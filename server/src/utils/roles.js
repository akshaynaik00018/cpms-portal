function canApply(user) { return user.role === 'student'; }
function isCompany(user) { return user.role === 'company'; }
function isTpo(user) { return user.role === 'tpo' || user.role === 'admin'; }
module.exports = { canApply, isCompany, isTpo };
