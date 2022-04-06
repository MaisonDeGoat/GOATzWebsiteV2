import BigNumber from 'bignumber.js';

export class Util {
    static getFormatTo(web3: any, amount: any, type: any) {
        return web3.utils.toWei((amount).toString(), type);
    }

    static getFormatFrom(web3: any, amount: any, type: any) {
        return web3.utils.fromWei((amount).toString(), type);
    }

    static getFormatedNumber(num: number, divideBy: number, fixUpto: number) {
        if (num === 0) {
            return 0;
        }
        return Number(this.getDecimals((num / divideBy).toFixed(fixUpto)));
    }

    static getDecimals(str: string) {
        if (str.endsWith('.000000')) {
            return Number(str.replace('.000000', ''));
        } else if (str.endsWith('.00000')) {
            return Number(str.replace('.00000', ''));
        } else if (str.endsWith('.0000')) {
            return Number(str.replace('.0000', ''));
        } else if (str.endsWith('.000')) {
            return Number(str.replace('.000', ''));
        } else if (str.endsWith('.00')) {
            return Number(str.replace('.00', ''));
        } else if (str.endsWith('.0')) {
            return Number(str.replace('.0', ''));
        } else {
            return Number(str)
        }
    }

    static getFormated(str: string) {
        if (str.endsWith('.000000')) {
            return str.replace('.000000', '');
        } else if (str.endsWith('.00000')) {
            return str.replace('.00000', '');
        } else if (str.endsWith('.0000')) {
            return str.replace('.0000', '');
        } else if (str.endsWith('.000')) {
            return str.replace('.000', '');
        } else if (str.endsWith('.00')) {
            return str.replace('.00', '');
        } else if (str.endsWith('.0')) {
            return str.replace('.0', '');
        } else {
            return this.removeTrailingZeros(str)
        }
    }

    static removeTrailingZeros(value: any) {
        // # if not containing a dot, we do not need to do anything
        if (!value || value.indexOf('.') === -1) {
            return value;
        }

        // # as long as the last character is a 0 or a dot, remove it
        while ((value.slice(-1) === '0' || value.slice(-1) === '.') && value.indexOf('.') !== -1) {
            value = value.substr(0, value.length - 1);
        }
        return value;
    }

    static getWei = (number: any, decimals: any) => {
        let baseNum: any = new BigNumber(10);
        let decimalBig:any = new BigNumber(decimals);
        return new BigNumber(number).multipliedBy(baseNum ** decimalBig);
    }

    static getWeiFormated = (number: any, decimals: any) => {
        let baseNum: any = new BigNumber(10);
        let decimalBig:any = new BigNumber(decimals);
        return Util.getFormated(new BigNumber(number).dividedBy(baseNum ** decimalBig).toFixed(6));
    }

    static isLess(num1: any, num2: any) {
        return new BigNumber(num1).lt(new BigNumber(num2));
    }

    static isLessEq(num1: any, num2: any) {
        return new BigNumber(num1).lte(new BigNumber(num2));
    }

    static isGratter(num1: any, num2: any) {
        return new BigNumber(num1).gt(new BigNumber(num2));
    }

    static isGratterEq(num1: any, num2: any) {
        return new BigNumber(num1).gte(new BigNumber(num2));
    }

    static getFormatedBigNum(num: any) {
        if (num) {
            return this.getFormated(new BigNumber(num).toFixed(6));
        }
        return num;
    }
}
