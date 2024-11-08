import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import * as nodemailer from 'nodemailer';
import { VinylRecordsService } from '../vinyl-records/vinyl-records.service';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { UserService } from 'src/user/user.service';
import { WinstonLoggerService } from 'src/logger/logger.service';

@Injectable()
export class PurchaseService {
    private stripe: Stripe;
    private webhookSecret: string;

    constructor(
    private readonly vinylRecordsService: VinylRecordsService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    private readonly logger: WinstonLoggerService
    ) {
        this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'));
        this.webhookSecret = this.configService.get<string>(
            'STRIPE_WEBHOOK_SECRET'
        );
    }

    verifyWebhookSignature(
        payload: Buffer,
        sig: string | string[]
    ): Stripe.Event {
        try {
            return this.stripe.webhooks.constructEvent(
                payload,
                sig,
                this.webhookSecret
            );
        } catch (err) {
            this.logger.error(
                `Stripe Webhook Signature Verification Failed: ${err.message}`
            );
            throw new HttpException(
                'Invalid webhook signature',
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async createCheckoutSession(vinylRecordId: number, userEmail: string) {
        const vinylRecord = await this.vinylRecordsService.findOne(vinylRecordId);

        if (!vinylRecord) {
            this.logger.error(`Vinyl record with ID ${vinylRecordId} not found`);
            throw new HttpException('Vinyl record not found', HttpStatus.NOT_FOUND);
        }

        try {
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: vinylRecord.name,
                            },
                            unit_amount: vinylRecord.price * 100,
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${this.configService.get('BASE_URL')}/purchase/success`,
                cancel_url: `${this.configService.get('BASE_URL')}/purchase/cancel`,
                customer_email: userEmail,
                metadata: {
                    vinylRecordId: vinylRecord.id.toString(),
                },
            });

            return session.url;
        } catch (error) {
            this.logger.error(
                `Failed to create Stripe checkout session: ${error.message}`
            );
            throw new HttpException(
                'Failed to initiate purchase',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
        const userEmail = session.customer_email;
        const vinylRecordId = +session.metadata.vinylRecordId;

        const vinylRecord = await this.vinylRecordsService.findOne(vinylRecordId);
        if (!vinylRecord) {
            this.logger.error(
                `Vinyl record with ID ${vinylRecordId} not found during purchase completion`
            );
            throw new HttpException('Vinyl record not found', HttpStatus.NOT_FOUND);
        }

        const user = await this.userService.findOneByEmail(userEmail);
        if (!user) {
            this.logger.error(`User with email ${userEmail} not found`);
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const purchase = this.purchaseRepository.create({ user, vinylRecord });
        await this.purchaseRepository.save(purchase);

        this.logger.log(`${userEmail} purchased record with ID ${vinylRecordId}`);
        await this.sendPurchaseConfirmation(userEmail, vinylRecord.name);
    }

    async sendPurchaseConfirmation(email: string, vinylRecordName: string) {
        const transporter = nodemailer.createTransport({
            host: this.configService.get('EMAIL_HOST'),
            port: this.configService.get('EMAIL_PORT'),
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: this.configService.get('EMAIL_PASS'),
            },
        });

        await transporter.sendMail({
            from: this.configService.get('EMAIL_USER'),
            to: email,
            subject: 'Purchase Confirmation',
            text: `Thank you for purchasing ${vinylRecordName}!`,
            html: `<p>Thank you for purchasing <strong>${vinylRecordName}</strong>!</p>`,
        });
    }
}
