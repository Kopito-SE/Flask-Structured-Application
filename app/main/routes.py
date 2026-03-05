from flask import Blueprint, session, redirect, url_for, flash, render_template, request
from ..models import User, Product
from .. import db

main = Blueprint("main", __name__)


@main.route("/")
def home():
    products = Product.query.all()
    return render_template("home.html", products=products)
@main.route("/dashboard")
def dashboard():
    if "user_id" not in session:
        flash("Please login first")
        return redirect(url_for("auth.login"))
    
    user = User.query.get(session["user_id"])
    products = Product.query.all()
    
    return render_template("dashboard.html", user=user, products=products)
@main.route("/add-product", methods=["GET","POST"])
def add_product():
    if "user_id" not in session:
        flash("Please Login First")
        return redirect(url_for("auth.login"))
    
    user = User.query.get(session["user_id"])

    if user.role != "admin":
        flash("Access Denied: Admins Only")
        return redirect(url_for("main.home"))
    
    if request.method == "POST":
        name = request.form.get("name")
        price = request.form.get("price")
        description = request.form.get("description")

        if not name or not price:
            flash("Name and Price are required!")
            return redirect(url_for("main.add_product"))

        new_product = Product(
            name=name,
            price=float(price), 
            description=description
        )   
        db.session.add(new_product)
        db.session.commit()

        flash("Product added successfully!")
        return redirect(url_for("main.home"))

    return render_template("add_product.html")