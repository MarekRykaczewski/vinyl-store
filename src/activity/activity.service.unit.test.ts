import { test } from 'node:test';
import assert from 'assert';
import { HttpException, HttpStatus } from '@nestjs/common';
import proxyquire from 'proxyquire';

test('ActivityService - readActivities should throw HttpException if log file does not exist', async () => {
    const fsMock = {
        existsSync: () => false, // Simulate that the file doesn't exist
    };
    const { ActivityService } = proxyquire('./activity.service', { fs: fsMock });

    const activityService = new ActivityService();

    try {
        await activityService.readActivities();
        assert.fail('Expected readActivities to throw an error');
    } catch (error) {
        assert.ok(error instanceof HttpException);
        assert.strictEqual(error.getStatus(), HttpStatus.NOT_FOUND);
        assert.deepStrictEqual(error.getResponse(), {
            message: 'Log file does not exist',
        });
    }
});

test('ActivityService - readActivities should return log content if log file exists', async () => {
    const fsMock = {
        existsSync: () => true, // Simulate that the file exists
        readFileSync: () => 'Mock log content', // Simulate the content of the file
    };
    const { ActivityService } = proxyquire('./activity.service', { fs: fsMock });

    const activityService = new ActivityService();
    const logs = await activityService.readActivities();

    assert.strictEqual(logs, 'Mock log content');
});

test('ActivityService - readActivities should throw HttpException on file read error', async () => {
    const fsMock = {
        existsSync: () => true, // Simulate that the file exists
        readFileSync: () => {
            throw new Error('File read error');
        }, // Simulate a read error
    };
    const { ActivityService } = proxyquire('./activity.service', { fs: fsMock });

    const activityService = new ActivityService();

    try {
        await activityService.readActivities();
        assert.fail('Expected readActivities to throw an error');
    } catch (error) {
        assert.ok(error instanceof HttpException);
        assert.strictEqual(error.getStatus(), HttpStatus.INTERNAL_SERVER_ERROR);
        assert.deepStrictEqual(error.getResponse(), {
            message: 'Error reading log file',
            error: 'File read error',
        });
    }
});
