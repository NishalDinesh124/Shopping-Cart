var express = require('express');
const { render, route } = require("../app")
var router = express.Router();
var productHelper = require("../helpers/product-helpers")
const fileUpload = require('express-fileupload');
const productHelpers = require('../helpers/product-helpers');
const adminHelpers = require('../helpers/admin-helpers')
const userHelpers = require('../helpers/user-helpers')

const verifyAdminLogin = function (req, res, next) {
  if (req.session.admin) {
    next()
  } else {
    res.redirect('admin/adminLogin')
  }
}

router.get('/', verifyAdminLogin, function (req, res, next) {
  let admin = req.session.admin
  productHelpers.getAllProducts().then((products) => {
    console.log(products);
    res.render('admin/view-products', { admin: true, products, admin });
  });

});

router.get('/add-products', function (req, res, next) {
  res.render('admin/add-products');
});
router.post('/add-products', function (req, res, next) {
  productHelpers.addProducts(req.body, (id) => {
    let image = req.files.image;
    console.log(id);
    image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.render("admin/add-products")
      } else {
        console.log(err);
      }
    });
  });
});
router.get('/delete-product', (req, res, next) => {
  let proId = req.query.id
  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect('/admin')
  })

});
router.get('/edit-product/:id', async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-products', { product })

});
router.post('/edit-product/:id', (req, res, next) => {
  console.log(req.params.id);
  let id = req.params.id
  productHelpers.updateProduct(req.params.id, req.body,).then(() => {
    res.redirect('/admin')
    if (req.files.image) {
      let image = req.files.image
      image.mv('./public/product-images/' + id + '.jpg')
    }
  })
});

router.get('/adminLogin', (req, res, next) => {
  console.log("Helo");
  if (req.session.admin) {
    res.redirect("/")
  }
  else {
    res.render("admin/login", { "loginErr": req.session.adminLoginErr })
    req.session.adminLoginErr = false
  }

});
router.post('/adminLogin', (req, res, next) => {
  adminHelpers.doLogin(req.body).then((response) => {
    if (response.status) {

      console.log("Admin loggedin succesfully");
      req.session.admin = response.admin
      req.session.admin.loggedIn = true
      res.redirect('/admin')
    } else {
      console.log("else working");
      req.session.adminLoginErr = "Invalid username or password";
      res.redirect('/admin/adminLogin');
    }
  })
});
router.get('/view-orders', verifyAdminLogin, async (req, res, next) => {
  let orders = await adminHelpers.getUserOrders(req.session)
  console.log(orders);
  res.render('admin/view-orders', { admin: req.session.admin, orders })
});
router.get('/get-all-users', verifyAdminLogin, async (req, res, next) => {
  let users = await adminHelpers.getAllUsers(req.session)
  console.log(users);
  res.render('admin/all-users', { admin: req.session.admin, users })
});
router.get('/logout', verifyAdminLogin, (req, res, next) => {
  console.log("log out working");
  req.session.admin = null
  res.redirect('/')
});
router.get('/remove-account', (req, res, next) => {
  let userId = req.query.id
  adminHelpers.removeUserAccount(userId).then((response) => {
    console.log(response);
    res.redirect('/admin/get-all-users')
  })
});
router.get('/view-ordered-user',async(req,res,next)=>{
  userId=req.query.id
  user=await adminHelpers.getOrderedUser(req.session,userId)
  console.log(user);
  res.render('admin/view-ordered-users',{admin:req.session.admin,user})
})
module.exports = router;
