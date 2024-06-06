class NCA {
    constructor() {
        this.publicKey = null;
        this.privateKey = null;
    }

    async generateKeys(bitlength = 2048) {
        const a = await this.generatePrime(bitlength / 2);
        const b = await this.generatePrime(bitlength / 2);
        const n = a * b;
        const phi = (a - 1n) * (b - 1n);
        const e = 65537n;
        const d = this.modInverse(e, phi);

        this.publicKey = { e: e.toString(), n: n.toString() };
        this.privateKey = { d: d.toString(), n: n.toString() };
    }

    modInverse(e, phi) {
        let [a, b] = [phi, e];
        let [x0, x1] = [0n, 1n];
        while (b !== 0n) {
            const q = a / b;
            [a, b] = [b, a % b];
            [x0, x1] = [x1, x0 - q * x1];
        }
        return x0 < 0n ? x0 + phi : x0;
    }

    async generatePrime(bits) {
        const min = 2n ** (BigInt(bits) - 1n);
        const max = 2n ** BigInt(bits) - 1n;
        while (true) {
            const p = this.getRandomBigInt(min, max);
            if (await this.isPrime(p)) return p;
        }
    }

    async isPrime(num) {
        if (num < 2n) return false;
        if (num % 2n === 0n) return num === 2n;
        const s = num - 1n;
        const d = s / 2n;
        for (let i = 0; i < 64; i++) {
            const a = 2n + this.getRandomBigInt(0n, num - 3n);
            if (!this.nonDual(num, a, d)) return false;
        }
        return true;
    }

    nonDual(n, a, d) {
        let x = this.modExp(a, d, n);
        if (x === 1n || x === n - 1n) return true;
        while (d !== n - 1n) {
            x = (x * x) % n;
            d *= 2n;
            if (x === n - 1n) return true;
        }
        return false;
    }

    modExp(base, exp, mod) {
        let result = 1n;
        base = BigInt(base) % BigInt(mod);
        while (exp > 0n) {
            if (exp % 2n === 1n) result = (result * base) % BigInt(mod);
            exp = exp >> 1n;
            base = (base * base) % BigInt(mod);
        }
        return result;
    }

    getRandomBigInt(min, max) {
        const range = max - min;
        const bits = range.toString(2).length;
        let randomBigInt;
        do {
            randomBigInt = this.getRandomBits(bits);
        } while (randomBigInt > range);
        return min + randomBigInt;
    }

    getRandomBits(bits) {
        const bytes = Math.ceil(bits / 8);
        const buffer = new Uint8Array(bytes);
        window.crypto.getRandomValues(buffer);
        let randomBigInt = 0n;
        for (const byte of buffer) {
            randomBigInt = (randomBigInt << 8n) | BigInt(byte);
        }
        return randomBigInt;
    }

    encrypt(message, key) {
        return this.modExp(this.strToBigInt(message), BigInt(key.e), BigInt(key.n));
    }

    decrypt(encrypted, key) {
        return this.bigIntToStr(this.modExp(encrypted, BigInt(key.d), BigInt(key.n)));
    }

    sign(message, key) {
        return this.modExp(this.strToBigInt(message), BigInt(key.d), BigInt(key.n)).toString();
    }

    verify(signature, key) {
        return this.bigIntToStr(this.modExp(BigInt(signature), BigInt(key.e), BigInt(key.n)));
    }

    strToBigInt(str) {
        const encoder = new TextEncoder();
        const byteArray = encoder.encode(str);
        let hexString = '';
        byteArray.forEach(byte => {
            hexString += byte.toString(16).padStart(2, '0');
        });
        return BigInt('0x' + hexString);
    }

    bigIntToStr(bigint) {
        const hexString = bigint.toString(16);
        const byteArray = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        const decoder = new TextDecoder();
        return decoder.decode(byteArray);
    }
}

export default NCA;
