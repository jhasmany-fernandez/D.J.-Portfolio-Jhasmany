import { Controller, Get, Patch, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FooterService } from './footer.service';
import { UpdateFooterDto } from './dto/update-footer.dto';

@ApiTags('Footer')
@Controller('footer')
export class FooterController {
  constructor(private readonly footerService: FooterService) {}

  @Get('active')
  @ApiOperation({ summary: 'Get active footer configuration' })
  getActive() {
    return this.footerService.getActive();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update footer configuration' })
  update(@Param('id') id: string, @Body() updateFooterDto: UpdateFooterDto) {
    return this.footerService.update(id, updateFooterDto);
  }
}
