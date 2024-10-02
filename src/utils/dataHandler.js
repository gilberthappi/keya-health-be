class DataHandler {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    search() {
        if (this.queryString.sk) {

            let searchConditions = [
                { fullNames: { $regex: this.queryString.sk, $options: "ix" } },
                { title: { $regex: this.queryString.sk, $options: "ix" } },
                { email: { $regex: this.queryString.sk, $options: "ix" } },
            ]

            this.query = this.query.find({ $or: searchConditions })
        }

        return this;
    }

    filter() {
        const queryObj = JSON.parse(JSON.stringify(this.queryString));
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'populate', 'sk'];
        excludedFields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|eq|ne|regex|lte|lt)\b/g, (match) => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr))
        return this;
    }

    populate() {
        let populateQuery = this.queryString.populate;
        if (populateQuery) {
            let populateFields = populateQuery.split(',').join(' ');
            this.query = this.query.find().populate(populateFields);
        }

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split('.').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-updatedAt');
        }

        return this;
    }

    paginate() {
        let page;
        if (this.queryString.page === '0' || this.queryString.page === undefined || this.queryString.page === '1') {
            page = 0;
        } else {
            page = this.queryString.page * 1;
        }
        const limit = this.queryString.limit * 1 || 15;
        const skip = page * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

export default DataHandler;