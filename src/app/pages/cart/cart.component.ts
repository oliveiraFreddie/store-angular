import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  loading: boolean = false;
  cart: Cart = {items: [{
    product: 'https://via.placeholder.com/150',
    name: 'sneakers',
    price: 150,
    quantity: 1,
    id: 1
  },
  {
    product: 'https://via.placeholder.com/150',
    name: 'sneakers',
    price: 150,
    quantity: 2,
    id: 2
  }]};

  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action'
  ];

  constructor(private cartService: CartService, private http: HttpClient) { }

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  onCheckout(): void {
    this.loading = true;
  
    this.http.post('https://fr3d-store-api.onrender.com/checkout', {
      items: this.cart.items
    }).subscribe(async (res: any) => {
      const stripe = await loadStripe('pk_test_51OkOltHMoqj2puA5WgFKFMsm5bufHYOKZ1WB5FzGUPHW5FT17hfZHhHcjJv7etGzsiJi8Ro3IU1v3LEnyPToKyHw00m5Mr1QyM');
      
      stripe?.redirectToCheckout({
        sessionId: res.id
      }).then((result) => {
        if (result.error) {
          console.error(result.error.message);
          // Trate os erros de redirecionamento aqui
        }
      }).finally(() => {
        this.loading = false;
      });
    });
  }
  

}
