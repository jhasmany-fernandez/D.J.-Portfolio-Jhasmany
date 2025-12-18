import { Controller, Get, Patch, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ServicesSectionService } from './services-section.service';
import { UpdateServicesSectionDto } from './dto/update-services-section.dto';

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
  @ApiOperation({ summary: 'Update services section' })
  @ApiResponse({ status: 200, description: 'Services section updated successfully' })
  update(@Param('id') id: string, @Body() updateDto: UpdateServicesSectionDto) {
    return this.servicesSectionService.update(id, updateDto);
  }
}
