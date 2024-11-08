import {
    Controller,
    Post,
    Param,
    Req,
    Res,
    UseGuards,
    Get,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import Stripe from 'stripe';

@ApiTags('Purchase')
@Controller('purchase')
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
      summary: 'Initiate purchase',
      description: 'Starts a Stripe checkout session for a vinyl record.',
  })
  @ApiParam({
      name: 'vinylRecordId',
      description: 'ID of the vinyl record to purchase',
      type: Number,
  })
  @ApiResponse({ status: 302, description: 'Redirects to Stripe checkout URL' })
  @ApiResponse({
      status: 401,
      description: 'Unauthorized - Bearer token missing or invalid',
  })
  @Post('checkout/:vinylRecordId')
    async initiatePurchase(
    @Param('vinylRecordId') vinylRecordId: number,
    @Req() req,
    @Res() res
    ) {
        try {
            const user = req.user;
            const checkoutUrl = await this.purchaseService.createCheckoutSession(
                vinylRecordId,
                user.email
            );
            return res.json({ checkoutUrl });
        } catch (error) {
            throw new HttpException(
                error.message || 'Internal server error',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

  @Get('success')
  @ApiOperation({
      summary: 'Purchase success',
      description: 'Displays a success message after payment completion',
  })
  @ApiResponse({ status: 200, description: 'Displays payment success message' })
  async success(@Req() req, @Res() res) {
      res.send('Payment was successful! Thank you for your purchase.');
  }

  @Get('cancel')
  @ApiOperation({
      summary: 'Purchase canceled',
      description: 'Displays a cancellation message if payment is canceled',
  })
  @ApiResponse({
      status: 200,
      description: 'Displays payment cancellation message',
  })
  async cancel(@Req() req, @Res() res) {
      res.send('Payment was canceled.');
  }

  @Post('webhook')
  @ApiOperation({
      summary: 'Stripe webhook handler',
      description: 'Handles Stripe webhook events for payment status updates',
  })
  @ApiResponse({
      status: 200,
      description: 'Acknowledges receipt of webhook event',
  })
  @ApiResponse({ status: 400, description: 'Invalid webhook signature' })
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
