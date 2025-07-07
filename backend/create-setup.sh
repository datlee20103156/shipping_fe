#!/bin/bash

RED='\033[1;31m'    # Màu đỏ (bold)
GREEN='\033[1;32m'  # Màu xanh lá (bold)
BLUE='\033[1;34m'   # Màu xanh nước biển (bold)
WHITE='\033[1;37m'  # Màu trắng (bold)
NC='\033[0m'        # Reset màu

# Nhập tên bảng
echo -e "${WHITE}Nhập tên bảng: ${NC}"
read tablename

if [ -z "$tablename" ]; then
    echo "${RED}Tên không được để trống! ${NC}"
    exit 1
fi

# Tạo biến class name với chữ cái đầu tiên viết hoa
classname=$(echo "$tablename" | awk '{print toupper(substr($0,1,1)) substr($0,2)}')

# Tạo nội dung của module
contentModule="
import { Module } from \"@nestjs/common\";
import { UsersModule } from \"src/users/users.module\";
import { MongooseModule } from \"@nestjs/mongoose\";

@Module({
    imports: [UsersModule],
    controllers: [],
    providers: [],
    exports: []
})
export class ${classname}Module {}
"

# Hỏi người dùng có muốn tạo folder và file không
read -p "$(echo -e "${WHITE}Bạn có muốn tạo file${NC} ${GREEN}$tablename.module.ts${NC} ${WHITE}trong thư mục 'src/$tablename'? với nội dung${NC} ${GREEN}$contentModule${NC} (y/n): ")" create_module
if [ "$create_module" == "y" ]; then
    # Tạo thư mục nếu chưa tồn tại
    mkdir -p "src/$tablename"
    mkdir -p "src/$tablename/dto"

    # Tạo file tablename.module.ts trong thư mục đó (nếu file chưa tồn tại)
    if [ ! -f "src/$tablename/$tablename.module.ts" ]; then
        echo "$contentModule" >"src/$tablename/$tablename.module.ts"
        echo -e "${BLUE}File $tablename/$tablename.module.ts đã được tạo!${NC}"
    else
        echo -e "${RED}File $tablename/$tablename.module.ts đã tồn tại!${NC}"
    fi

    # Cập nhật app.module.ts
    # Thêm import module vào đầu file app.module.ts
    importLine="import { ${classname}Module } from './$tablename/$tablename.module';"
    if ! grep -q "$importLine" "src/app.module.ts"; then
        # Chèn vào đầu file app.module.ts với việc xuống dòng
        sed -i '' "1i\\
$importLine" src/app.module.ts

        echo -e "${BLUE}Đã thêm import ${classname}Module vào src/app.module.ts${NC}"
    fi

    # Thêm ${classname}Module vào imports với xuống dòng và đúng khoảng trắng
    sed -i '' "/imports: \[/a\\
${classname}Module," src/app.module.ts
    echo -e "${BLUE}Đã thêm ${classname}Module vào imports trong src/app.module.ts${NC}"

else
    echo -e "${RED}Quá trình đã bị hủy!${NC}"
    exit 0
fi

# Tạo nội dung của controller
contentController="
import { Control } from \"src/common/meta/control.meta\";

@Control('${tablename}')
export class ${classname}Controller {
    constructor(){}
}
"
# Hỏi người dùng có muốn tạo folder và file không
echo -e "${WHITE}Bạn có muốn tạo file${NC} ${GREEN}$tablename.controller.ts${NC} ${WHITE}trong thư mục 'src/$tablename'? với nội dung ${GREEN}$contentController${NC} (y/n): "
read create_controller

if [ "$create_controller" == "y" ]; then
    # Tạo thư mục nếu chưa tồn tại
    mkdir -p "src/$tablename"

    # Tạo file tablename.module.ts trong thư mục đó (nếu file chưa tồn tại)
    if [ ! -f "src/$tablename/$tablename.controller.ts" ]; then
        echo "$contentController" >"src/$tablename/$tablename.controller.ts"
        echo -e "${BLUE}File $tablename/$tablename.controller.ts đã được tạo!${NC}"
    else
        echo -e "${RED}File $tablename/$tablename.controller.ts đã tồn tại!${NC}"
    fi

    # Cập nhật tablename.module.ts
    # Thêm import module vào đầu file tablename.module.ts
    importLine="import { ${classname}Controller } from './$tablename.controller';"
    if ! grep -q "$importLine" "src/${tablename}/${tablename}.module.ts"; then
        # Chèn vào đầu file classname.module.ts với việc xuống dòng
        sed -i '' "1i\\
$importLine" src/$tablename/$tablename.module.ts

        echo -e "${BLUE}Đã thêm import ${classname}Controller vào src/$tablename/$tablename.module.ts${NC}"
    fi

    # Thêm ${classname}Controller vào controllers với xuống dòng
    sed -i '' "/controllers: \[/s/\]/, ${classname}Controller]/" src/$tablename/$tablename.module.ts

    echo -e "${BLUE}Đã thêm ${classname}Controller vào controllers trong src/$tablename/$tablename.module.ts${NC}"

fi

# Tạo nội dung của service
contentService="
import { Injectable } from \"@nestjs/common\";

@Injectable()
export class ${classname}Service {
    constructor() {}
}
"

echo -e "${WHITE}Bạn có muốn tạo file${NC} ${GREEN}$tablename.service.ts${NC} ${WHITE}trong thư mục 'src/$tablename'? với nội dung ${GREEN}$contentService${NC} (y/n): "
read create_service
if [ "$create_service" == "y" ]; then
    # Tạo thư mục nếu chưa tồn tại
    mkdir -p "src/$tablename"

    # Tạo file tablename.service.ts trong thư mục đó (nếu file chưa tồn tại)
    if [ ! -f "src/$tablename/$tablename.service.ts" ]; then
        echo "$contentService" > "src/$tablename/$tablename.service.ts"
        echo -e "${BLUE}File $tablename/$tablename.service.ts đã được tạo!${NC}"
    else
        echo -e "${RED}File $tablename/$tablename.service.ts đã tồn tại!${NC}"
    fi

    # Cập nhật tablename.module.ts
    # Thêm import module vào đầu file tablename.module.ts

        importLine="import { ${classname}Service } from './$tablename.service';"
    if ! grep -q "$importLine" "src/${tablename}/${tablename}.module.ts"; then
        # Chèn vào đầu file classname.module.ts với việc xuống dòng
        sed -i '' "1i\\
$importLine" src/$tablename/$tablename.module.ts
    fi

    if ! grep -q "$importLine" "src/${tablename}/${tablename}.controller.ts"; then
        # Chèn vào đầu file classname.controller.ts với việc xuống dòng
        sed -i '' "1i\\
$importLine" src/$tablename/$tablename.controller.ts

        echo -e "${BLUE}Đã thêm import ${classname}Controller vào src/$tablename/$tablename.module.ts${NC}"

        echo -e "${BLUE}Đã thêm import ${classname}Service vào src/$tablename/$tablename.module.ts${NC}"
    fi

    # Thêm ${classname}Service vào providers và exports với xuống dòng
    sed -i '' "/providers: \[/s/\]/, ${classname}Service]/" src/$tablename/$tablename.module.ts

    read -p "Bạn có muốn exports ${classname}Service (y/n): " isExports
    if [ "$isExports" == "y" ]; then
        sed -i '' "/exports: \[/s/\]/, ${classname}Service]/" src/$tablename/$tablename.module.ts
    fi

    sed -i '' -E "s/(constructor\s*\()/\1private readonly _${tablename}Service: ${classname}Service, /" src/$tablename/$tablename.controller.ts

    echo -e "${BLUE}Đã thêm ${classname}Service vào service trong src/$tablename/$tablename.module.ts${NC}"
fi

contentSchema="
import { Injectable } from \"@nestjs/common\";

import { Prop, Schema, SchemaFactory } from \"@nestjs/mongoose\";
import * as mongoose from \"mongoose\";

@Schema({
  timestamps: true
})
export class $classname {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
    _id: string;


}

export type ${classname}Document = $classname & Document;
export const ${classname}Schema = SchemaFactory.createForClass($classname);
"

contentRepo="
import { Injectable } from \"@nestjs/common\";
import { Model } from \"mongoose\";
import { ${classname}, ${classname}Document } from \"src/${tablename}/schema/${tablename}.schema\";
import { InjectModel } from \"@nestjs/mongoose\";


@Injectable()
export class ${classname}Repo {
    private readonly _${tablename}Model: Model<${classname}Document>
    constructor(@InjectModel(${classname}.name) ${tablename}Model: Model<${classname}Document>){
        this._${tablename}Model = ${tablename}Model;
    }
    
    async create${classname}(data: any): Promise<${classname}Document> {
        return await this._${tablename}Model.create(data);
    }

    async createMany${classname}(data: any): Promise<any>{
        return await this._${tablename}Model.insertMany(data);
    }

    async find${classname}ById(id: any): Promise<${classname}Document> {
        return await this._${tablename}Model.findById(id);
    }

    async findOne${classname}ByCondition(condition: any): Promise<${classname}Document> {
        return await this._${tablename}Model.findOne(condition);
    }

    async find${classname}ByCondition(condition: any): Promise<any> {
        return await this._${tablename}Model.find(condition);
    }

    async update${classname}(id: any, data: any): Promise<${classname}Document> {
        return await this._${tablename}Model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete${classname}(id: any){
        return await this._${tablename}Model.findByIdAndDelete(id);
    }

}
"

echo -e "${WHITE}Bạn có muốn tạo file${NC} ${GREEN}$tablename.schema.ts${NC} ${WHITE}trong thư mục 'src/$tablename'? với nội dung ${GREEN}$contentSchema ${BLUE}(y/n): "
read create_schema
if [ "$create_schema" == "y" ]; then
    # Tạo thư mục nếu chưa tồn tại
    mkdir -p "src/$tablename/schema"

    # Tạo file tablename.schema.ts trong thư mục đó (nếu file chưa tồn tại)
    if [ ! -f "src/$tablename/schema/$tablename.schema.ts" ]; then
        echo "$contentSchema" > "src/$tablename/schema/$tablename.schema.ts"
        echo -e "${BLUE}File $tablename/schema/$tablename.schema.ts đã được tạo!${NC}"
    else
        echo -e "${RED}File $tablename/schema/$tablename.schema.ts đã tồn tại!${NC}"
    fi

    # Tạo file tablename.repo.ts trong thư mục đó (nếu file chưa tồn tại)
    if [ ! -f "src/$tablename/$tablename.repo.ts" ]; then
        echo "$contentRepo" > "src/$tablename/$tablename.repo.ts"
        echo -e "${BLUE}File $tablename/$tablename.repo.ts đã được tạo!${NC}"
    else
        echo -e "${RED}File $tablename/$tablename.repo.ts đã tồn tại!${NC}"
    fi

    # Cập nhật tablename.module.ts
    # Thêm import module vào đầu file tablename.module.ts

    # Thêm ${classname}Service vào providers và exports với xuống dòng
    sed -i '' "/providers: \[/s/\]/, ${classname}Repo]/" src/$tablename/$tablename.module.ts

    read -p "Bạn có muốn exports ${classname}Repo (y/n): " isExports
    if [ "$isExports" == "y" ]; then
        sed -i '' "/exports: \[/s/\]/, ${classname}Repo]/" src/$tablename/$tablename.module.ts
    fi

        importLine="import { ${classname}, ${classname}Schema } from './schema/$tablename.schema';"
    if ! grep -q "$importLine" "src/${tablename}/${tablename}.module.ts"; then
        # Chèn vào đầu file classname.module.ts với việc xuống dòng
        sed -i '' "1i\\
$importLine" src/$tablename/$tablename.module.ts
    fi

    importLine="import {${classname}Repo } from './$tablename.repo';"
    if ! grep -q "$importLine" "src/${tablename}/${tablename}.module.ts"; then
        # Chèn vào đầu file classname.module.ts với việc xuống dòng
        sed -i '' "1i\\
$importLine" src/$tablename/$tablename.module.ts
    fi

    sed -i '' "/imports: \[/s/\]/, MongooseModule.forFeature([{name: ${classname}.name, schema: ${classname}Schema}])]/" src/$tablename/$tablename.module.ts

        importLine="import { ${classname}Repo } from './$tablename.repo';"
    if ! grep -q "$importLine" "src/${tablename}/${tablename}.service.ts"; then
        sed -i '' "1i\\
$importLine" src/$tablename/$tablename.service.ts

    sed -i '' -E "s/(constructor\s*\()/\1private readonly _${tablename}Repo: ${classname}Repo, /" src/$tablename/$tablename.service.ts


    echo -e "${BLUE}Đã thêm ${classname}Repo vào service trong src/$tablename/$tablename.module.ts${NC}"
    fi
fi
