import { Controller, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesSectionService } from './services-section.service';
import { UpdateServicesSectionDto } from './dto/update-services-section.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { demoEntity, isVisitor } from '../auth/utils/demo-response';

@ApiTags('services-section')
@Controller('services-section')
export class ServicesSectionController {
  constructor(private readonly servicesSectionService: ServicesSectionService) {}

  @Get('active')
  @ApiOperation({ summary: 'Get active services section' })
  @ApiResponse({ status: 200, description: 'Return active services section' })
  getActive() {
    return this.servicesSectionService.getActive();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'visitor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update services section' })
  @ApiResponse({ status: 200, description: 'Services section updated successfully' })
  update(@Param('id') id: string, @Body() updateDto: UpdateServicesSectionDto, @Request() req) {
    if (isVisitor(req)) {
      return this.servicesSectionService.getActive().then((section) => demoEntity(updateDto, section));
    }
    return this.servicesSectionService.update(id, updateDto);
  }
}
