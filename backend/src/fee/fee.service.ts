import { StringUtils } from 'src/common/utils/string.utils';
import { FeeRepo } from './fee.repo';
import { Injectable } from "@nestjs/common";
import { CreateShippingConfigDto } from './dto/create.dto';
import { UpdateShippingConfigDto } from './dto/update.dto';
import { GetFeeByCondition } from './dto/condition.dto';

@Injectable()
export class FeeService {
    constructor(private readonly _feeRepo: FeeRepo, ) {}

    async createDto(createDto: CreateShippingConfigDto) {
        console.log("createDto", createDto);
        const data = {
            _id: StringUtils.generateObjectId(),
            fromDistrict: createDto.fromDistrict,
            toDistrict: createDto.toDistrict,
            baseFee: createDto.baseFee,
            extraPerKg: createDto.extraPerKg,
            additionalFees: createDto.additionalFees || [],
            isActive: createDto.isActive !== undefined ? createDto.isActive : true, //
        };
        return await this._feeRepo.createFee(data);
    }

    async updateDto(id: string, updateDto: Partial<UpdateShippingConfigDto>) {
        return await this._feeRepo.updateFee(id, updateDto);
    }

    async getDistrictFees(fromDistrict: string, toDistrict: string) {
        return await this._feeRepo.getDistrictFees(fromDistrict, toDistrict);
    }

    async getFeeByCondition(condition: GetFeeByCondition){
        return await this._feeRepo.getFeeByCondition(condition);
    }

    async getById(id: string){
        return await this._feeRepo.findFeeById(id);
    }
}

