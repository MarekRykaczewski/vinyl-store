import {
    Controller,
    Post,
    Param,
    Req,
    Res,
    UseGuards,
    Get,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import Stripe from 'stripe';

@Controller('purchase')
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('checkout/:vinylRecordId')
    async initiatePurchase(
    @Param('vinylRecordId') vinylRecordId: number,
    @Req() req,
    @Res() res
    ) {
        const user = req.user;
        const checkoutUrl = await this.purchaseService.createCheckoutSession(
            vinylRecordId,
            user.email
        );

        return res.redirect(checkoutUrl);
    }

  @Get('success')
  async success(@Req() req, @Res() res) {
      res.send('Payment was successful! Thank you for your purchase.');
  }

  @Get('cancel')
  async cancel(@Req() req, @Res() res) {
      res.send('Payment was canceled.');
  }

  @Post('webhook')
  async handleStripeWebhook(@Req() req, @Res() res) {
      const sig = req.headers['stripe-signature'];
      let event;

      try {
          event = this.purchaseService.verifyWebhookSignature(req.rawBody, sig);
      } catch (err) {
          return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      if (event.type === 'checkout.session.completed') {
          const session = event.data.object as Stripe.Checkout.Session;
          await this.purchaseService.handleCheckoutSessionCompleted(session);
      }

      res.json({ received: true });
  }
}
