module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};


// module.exports = (fun) => {
//   return async function (req, res, next) {
//     try {
//       await fun(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   };
// };