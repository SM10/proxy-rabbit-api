require('dotenv').config();

module.exports = [
    {
        name: `Coffee Crisp`,
        image_url: `${process.env.THIS_URL}/images/coffee-crisp.jpg`,
        country_id: 0
    },
    {
        name: `Kraft Dinner`,
        image_url: `${process.env.THIS_URL}/images/kraft-dinner.png`,
        country_id: 0,
        views: 5
    },{
        name: `187 Shirt`,
        image_url: `${process.env.THIS_URL}/images/187-shirt.jpg`,
        country_id: 1,
        views: 4,
    },
    {
        name: `Lays Ketchup`,
        image_url: `${process.env.THIS_URL}/images/lays-ketchup.jpg`,
        country_id: 0
    },{
        name: `Blood Wizard Skateboard`,
        image_url: `${process.env.THIS_URL}/images/blood-wizard-skateboard.jpg`,
        country_id: 1
    },{
        name: `Giro Helmet`,
        image_url: `${process.env.THIS_URL}/images/giro-helmet.jpg`,
        country_id: 1
    },{
        name: `Cadbury Bournville`,
        image_url: `${process.env.THIS_URL}/images/cadbury-bournville.jpg`,
        country_id: 2
    },{
        name: `Sweet Peanuts`,
        image_url: `${process.env.THIS_URL}/images/sweet-peanuts.jpg`,
        country_id: 2
    },{
        name: `Marzipan Tea Cakes from Ye Oldest Sweet Shop In The World`,
        image_url: `${process.env.THIS_URL}/images/mazipan-tea-cakes-ye-oldest-sweet-shop-in-the-world.jpg`,
        country_id: 2
    },{
        name: `Kangaroo Leather Jacket`,
        image_url: `${process.env.THIS_URL}/images/rean-mccaul-kangaroo-leather-jacket.jpg`,
        country_id: 3,
        views: 2
    },{
        name: `Didgeridoo`,
        image_url: `${process.env.THIS_URL}/images/didgeridoo.jpg`,
        country_id: 3
    },{
        name: `Anzac Biscuit`,
        image_url: `${process.env.THIS_URL}/images/anzac-biscuit.jpg`,
        country_id: 3
    },{
        name: `Puhoi Valley Chocolage Milk`,
        image_url: `${process.env.THIS_URL}/images/puhoi-valley-chocolate-milk.jpg`,
        country_id: 4
    }
]