// // const asyncHandler =(requestHandler)=>{
// //    return (req,res,next)=>{
// //         Promise.resolve(requestHandler(req,res,next)).then((resolve)=>{console.log("ye err he me asynhandeler file se hon ",resolve)})

// //     }
// // }

// // export default asyncHandler


// const asyncHandler = (requestHandler) => {
//   return (req, res, next) => {
//     Promise.resolve(requestHandler(req, res, next))
//       .catch((err) => {
//         console.error("Error from asyncHandler:", err);
//         next(err); // Express ke error middleware me bhejo
//       });
//   };
// };

// export default asyncHandler;



const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      console.error("Error from asyncHandler:", err);
      next(err); // IMPORTANT: forward to error middleware
    });
  };
};
export default asyncHandler;
