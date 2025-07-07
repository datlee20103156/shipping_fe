import mongoose from "mongoose";

export class StringUtils {

  private static readonly chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Bỏ các ký tự dễ nhầm

    static generateObjectId(): string {
      return new mongoose.Types.ObjectId().toString();
    }
  
    static ObjectId(str: string) {
      return new mongoose.Types.ObjectId(str);
    }

    static generateUniqueCode(length: number): string {
        let code = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * this.chars.length);
            code += this.chars[randomIndex];
        }
        return code;
    }
}