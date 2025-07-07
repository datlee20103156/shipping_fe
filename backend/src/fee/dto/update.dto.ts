import { PartialType } from '@nestjs/swagger';
import { CreateShippingConfigDto } from './create.dto';

export class UpdateShippingConfigDto extends PartialType(CreateShippingConfigDto) {}
