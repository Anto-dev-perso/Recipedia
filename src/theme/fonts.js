import Metrics from './metrics'

const size = {
    font6: Metrics.screenWidth * (6 / 365),
    font8: Metrics.screenWidth * (8 / 365),
    font10: Metrics.screenWidth * (10 / 365),
    font12: Metrics.screenWidth * (12 / 365),
    font14: Metrics.screenWidth * (14 / 365),
    font16: Metrics.screenWidth * (16 / 365),
    font20: Metrics.screenWidth * (20 / 365),
};

const weight = {
    full: '900',
    semi: '600',
    low: '400',
    bold: 'bold',
    normal: 'normal',
};

const type = {
    montserratMedium: 'Montserrat-Medium'
    montserratRegular: 'Montserrat-Regular'
    montserratSemiBold: 'Montserrat-SemiBold',
};

export default {
    size,
    weight,
    type,
};