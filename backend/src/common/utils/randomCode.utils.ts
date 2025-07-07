export class RandomCodeUtils {
  private static readonly chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Bỏ các ký tự dễ nhầm

  static generateUniqueCode(length: number): string {
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * this.chars.length);
      code += this.chars[randomIndex];
    }

    const timestamp = Date.now().toString(36).toUpperCase(); // Base36 cho gọn
    return `${code}-${timestamp}`;
  }
}
