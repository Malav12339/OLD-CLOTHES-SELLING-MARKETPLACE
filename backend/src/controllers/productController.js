const Product = require('../models/Product');
const Category = require('../models/Category')
const Subcategory = require('../models/Subcategory')

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        console.log(product)
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product" });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { title, description, price, categoryName, subcategoryName, size, condition } = req.body;
        const imageName = req.file ? req.file.filename : "";

        // Validate that the subcategory belongs to the category
        const subcategory = await Subcategory.findOne({ 
            name: subcategoryName, 
            categoryName: categoryName 
        });

        if (!subcategory) {
            return res.status(400).json({ 
                message: `Invalid subcategory. '${subcategoryName}' is not a valid subcategory for '${categoryName}'` 
            });
        }

        const newProduct = new Product({
            sellerId: req.userId,
            title,
            description,
            price,
            categoryName,
            subcategoryName,
            size,
            condition,
            images: [imageName]
        });

        await newProduct.save();
        res.status(201).json({ 
            message: "Product added successfully", 
            product: {
                id: newProduct._id,
                title: newProduct.title,
                categoryName: newProduct.categoryName,
                subcategoryName: newProduct.subcategoryName,
                price: newProduct.price,
                imageName 
            }
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Error adding product", error: error.message });
    }
};

// have to cross check code
exports.editProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // `runValidators: true` ensures validation is applied
        );

        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: "Sorry, cannot update product" });
    }
};

// working 
exports.deleteProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      
      
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        
        res.status(200).send(categories)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getSubCategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find()
        res.status(200).send(subcategories)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Add a new category - POST request handler
exports.addCategory = async (req, res) => {
    if(req.role !== 'admin') 
      return res.status(403).json({ message: "Unauthorized user" });
    
    try {
      const { name, displayName } = req.body;
  
      // Basic input validation
      if (!name || !displayName) {
        return res.status(400).json({
          success: false,
          message: 'Name and displayName are required'
        });
      }
  
      const category = new Category({
        name: name.toLowerCase(),
        displayName
      });
      
      const savedCategory = await category.save();
      res.status(201).json({
        success: true,
        category: savedCategory,
        message: 'Category created successfully'
      });
    } catch (error) {
      // Handle specific Mongoose duplicate key error
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to create category'
      });
    }
}

// Add a new subcategory - POST request handler
exports.addSubcategory = async (req, res) => {
    if(req.role !== 'admin') 
      return res.status(403).json({ message: "Unauthorized user" });
    try {
      const { name, displayName, categoryName } = req.body;
  
      // Basic input validation
      if (!name || !displayName || !categoryName) {
        return res.status(400).json({
          success: false,
          message: 'Name, displayName, and categoryName are required'
        });
      }
  
      // Verify category exists
      const category = await Category.findOne({ 
        name: categoryName.toLowerCase() 
      });
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
  
      const subcategory = new Subcategory({
        name: name.toLowerCase(),
        displayName,
        categoryName: category.name
      });
      
      const savedSubcategory = await subcategory.save();
      res.status(201).json({
        success: true,
        subcategory: savedSubcategory,
        message: 'Subcategory created successfully'
      });
    } catch (error) {
      // Handle specific Mongoose duplicate key error
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Subcategory already exists for this category'
        });
      }
      
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to create subcategory'
      });
    }
}