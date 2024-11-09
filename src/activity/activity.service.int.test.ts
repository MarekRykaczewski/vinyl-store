import { HttpException, HttpStatus } from '@nestjs/common';
import * as assert from 'assert';
import { describe, it, beforeEach } from 'node:test';
import proxyquire from 'proxyquire';

// Mocking fs module
const fsMock = {
    existsSync: () => {},
    readFileSync: () => {},
};

describe('ActivityService', () => {
    let activityService: any;

    beforeEach(() => {
    // Proxy the module with the mocked fs
        const { ActivityService } = proxyquire('./activity.service', {
            fs: fsMock,
        });

        activityService = new ActivityService();
    });

    it('should successfully read activities from the log file', async () => {
        const logContent = 'Test log content';
        fsMock.existsSync = () => true;
        fsMock.readFileSync = () => logContent;

        const result = await activityService.readActivities();
        assert.strictEqual(result, logContent);
    });

    it('should throw HttpException with 404 status when log file does not exist', async () => {
        fsMock.existsSync = () => false;

        try {
            await activityService.readActivities();
            assert.fail('Expected HttpException not thrown');
        } catch (error) {
            assert.ok(error instanceof HttpException);
            assert.strictEqual(error.getStatus(), HttpStatus.NOT_FOUND);

            const response = error.getResponse();
            assert.strictEqual(response['message'], 'Log file does not exist');
        }
    });

    it('should throw HttpException with 500 status on read error', async () => {
        fsMock.existsSync = () => true;
        fsMock.readFileSync = () => {
            throw new Error('Simulated read error');
        };

        try {
            await activityService.readActivities();
            assert.fail('Expected HttpException not thrown');
        } catch (error) {
            assert.ok(error instanceof HttpException);
            assert.strictEqual(error.getStatus(), HttpStatus.INTERNAL_SERVER_ERROR);

            const response = error.getResponse();
            assert.strictEqual(response['message'], 'Error reading log file');
            assert.strictEqual(response['error'], 'Simulated read error');
        }
    });
});
