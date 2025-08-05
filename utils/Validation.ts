export class Validation {
    static validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePhoneNumber(phone: number | string): boolean {
        const phoneRegex = /^\+?\d{10,15}$/;
        return phoneRegex.test(phone.toString());
    }

    static validateName(name: string): boolean {
        return name.trim().length >= 2;
    }
}
