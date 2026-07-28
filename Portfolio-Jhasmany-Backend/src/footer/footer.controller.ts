import { Controller, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FooterService } from './footer.service';
import { UpdateFooterDto } from './dto/update-footer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { demoEntity, isVisitor } from '../auth/utils/demo-response';

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'visitor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update footer configuration' })
  update(@Param('id') id: string, @Body() updateFooterDto: UpdateFooterDto, @Request() req) {
    if (isVisitor(req)) {
      return this.footerService.getActive().then((footer) => demoEntity(updateFooterDto, footer));
    }
    return this.footerService.update(id, updateFooterDto);
  }
}
