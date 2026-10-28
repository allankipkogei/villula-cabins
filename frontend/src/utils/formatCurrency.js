/**
 * Currency utility helpers for Villula Cabins Resort
 * Formats all monetary amounts to Kenyan Shillings (KSh / KES).
 */

export const formatKSh = (val) => {
  const num = Number(val) || 0;
  return `KSh ${Math.round(num).toLocaleString('en-KE')}`;
};

export const formatKShDecimals = (val) => {
  const num = Number(val) || 0;
  return `KSh ${num.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default formatKSh;
