const router = require('express').Router();
const { User, Restaurant, Review } = require('../models');
const withAuth = require('../util/auth');

// /restaurant


// gets all restaurants
router.get('/', withAuth, async function(req , res) {
    const findUser = await User.findOne({
        where: {
            id: req.session.user_id,
        }
    });
    
    const currentUser = await findUser.get({ plain: true });

// gets restaurants user added
    const restaurantData = await Restaurant.findAll({
        order: [['date_created', 'DESC'], 
    ],
        where: {
             user_id: req.session.user_id,
        },
        include: [
            {
              model: Users,
              attributes: ['name'],
            },
            {
                model: Comments,
                include: [Users],
                attributes: {
                    exclude: ['password'],
                }
                
            }
          ],
    });

    const userRestaurants = restaurantData.map((eachRest) => 
    eachRest.get({ plain: true })
    );

    console.log(JSON.stringify(userRestaurants));
    res.render('', { userRestaurants, 
        logged_in: req.session.logged_in, currentUser});

});


// for when click on restaurant to get info
router.get('/:id', withAuth, async function (req, res) {
    const restaurantData  = await Restaurant.findByPk(req.params.id);

    const restaurantGetter = await restaurantData.get({ plain: true });

    console.log(JSON.stringify(restaurantGetter));
   
    res.render('res', { postGetter, 
        logged_in: req.session.logged_in, });

});

module.exports = router;