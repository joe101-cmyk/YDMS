import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../common/types/request-with-user';

@ApiTags('Reviews')
@ApiBearerAuth()
@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({ summary: 'Create a review' })
  create(@Req() req: RequestWithUser, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(req.user!.id, createReviewDto);
  }
}
