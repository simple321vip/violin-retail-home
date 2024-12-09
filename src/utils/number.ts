const toPercent = (num: number) => {
  return (num * 100).toFixed(2) + "%"
}

const addZero = (num: number) => {
  if (num > 10) {
    return num
  }
  return '0' + num
}

// 移动电话check
function isPhoneNumber(input: any) {
  const regex = /^\d{11}$/;
  return regex.test(input);
}

const ToString = (value: number) => {
  return value.toLocaleString()
}

const GetSum = (obj: object, ...props: any[]) => {
  return props.filter(prop => prop in obj).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
}

const CheckPlusNumber = (num: any) => {
  console.log(typeof num)
  if (typeof num != "number" || num < 0) {
    return false
  }
  return true
}

export {
  toPercent,
  addZero,
  ToString,
  GetSum,
  CheckPlusNumber,
  isPhoneNumber
}