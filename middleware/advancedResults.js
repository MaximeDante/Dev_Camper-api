// shortahnd for putting a function inside of a function
const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

	// Copy req.query
	const reqQuery = { ...req.query };

	// fields to exclude
	const removeFields = ["select", "sort", "page", 'limit'];

	// Loop over remoceFields and delete them from reqQuery
	removeFields.forEach((param) => delete reqQuery[param]);

	// Buiding a query parameters string
	let queryStr = JSON.stringify(reqQuery);

	// Create  operators like ($gt, $gte, etc)
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	// convert back json to object
    query = JSON.parse(queryStr);
    
    let databaseQuery;
    
	// Finding  a resource and executing the query
	databaseQuery = model.find(query).sort("-createdAt");
	
	// select fields
	if (req.query.select) {
		const fields = req.query.select.split(",").join(" ");
		databaseQuery = databaseQuery.select(fields);
    }
  
    // Sort
	if (req.query.sort) {
		const sortBy = req.query.sort.split(",").join(" ");
		databaseQuery = databaseQuery.sort(sortBy);
    }

     // pagination
     const page = parseInt(req.query.page, 10) || 1;
     const limit = parseInt(req.query.limit, 10) || 25;
     const  startIndex = (page - 1)* limit;
     const endIndex = page * limit;
     const total = await model.countDocuments();
 
     databaseQuery = databaseQuery.skip(startIndex).limit(limit);


     if(populate){
        databaseQuery = databaseQuery.populate(populate)
     }
 
     // executing the query
    const results = await databaseQuery;

    // pagination result
    const pagination = {};
 
    if(endIndex < total){
        pagination.next ={
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0){
        pagination.prev ={
            page: page -1,
            limit
        }
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results 
    }

    next();
};



module.exports = advancedResults;
