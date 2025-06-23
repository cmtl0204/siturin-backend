import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseHttpInterface } from '../../../utils/interfaces';
import { CataloguesService } from '@modules/common/catalogue/catalogue.service';
import {
  CreateCatalogueDto,
  FilterCatalogueDto,
  UpdateCatalogueDto,
} from '@modules/common/catalogue/dto';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { CatalogueTypeEnum } from '../../../utils/enums';
import { PublicRoute } from '@auth/decorators';

@ApiTags('Catalogues')
@Controller('catalogues')
export class LocationController {
  constructor(private catalogueService: CataloguesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreateCatalogueDto) {
    const data = await this.catalogueService.create(payload);

    return {
      data,
      message: 'created',
    };
  }

  @ApiOperation({ summary: 'List all catalogues' })
  @Get('catalogue')
  @HttpCode(HttpStatus.OK)
  async catalogue(@Query('type') type: CatalogueTypeEnum) {
    const response = await this.catalogueService.catalogue(type);
    return {
      data: response,
      message: `catalogue`,
      title: `Catalogue`,
    } as ResponseHttpInterface;
  }

  @ApiOperation({ summary: 'List of catalogues' })
  // @Roles(RoleEnum.ADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: FilterCatalogueDto) {
    const response = await this.catalogueService.findAll(params);
    return {
      data: response.data,
      pagination: response.pagination,
      message: `index`,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.catalogueService.findOne(id);
    return {
      data,
      message: `show ${id}`,
      title: `Success`,
    } as ResponseHttpInterface;
  }

  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateCatalogueDto) {
    const data = await this.catalogueService.update(id, payload);

    return {
      data: data,
      message: `Catalogue updated ${id}`,
      title: `Updated`,
    } as ResponseHttpInterface;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.catalogueService.remove(id);

    return {
      data,
      message: `Catalogue deleted ${id}`,
      title: `Deleted`,
    };
  }

  @PublicRoute()
  @ApiOperation({ summary: 'Find Cache' })
  @Get('cache/get')
  @HttpCode(HttpStatus.OK)
  async findCache(): Promise<ResponseHttpInterface> {
    const response = await this.catalogueService.findCache();
    return {
      data: response,
      message: `Cache de Catalogos`,
      title: `Cache`,
    };
  }

  @ApiOperation({ summary: 'Load Cache' })
  @Get('cache/load')
  @HttpCode(HttpStatus.OK)
  async loadCache(): Promise<ResponseHttpInterface> {
    const response = await this.catalogueService.loadCache();
    return {
      data: response,
      message: `Load Cache de Catalogos`,
      title: `Load Cache`,
    };
  }
}
