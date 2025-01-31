import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLoggedIn = false;

  constructor(private msalService: MsalService, private router: Router) { }

  ngOnInit(): void {
    const account = this.msalService.instance.getActiveAccount();
    this.isLoggedIn = !!account;
    console.log('account', this.isLoggedIn, account);

    if (this.isLoggedIn) {
      sessionStorage.setItem('user', account?.username || '');
      sessionStorage.setItem('token', this.msalService.instance.getActiveAccount()?.idToken || '');
    }
  }

  login() {
    console.log('login');
    this.msalService.loginPopup().subscribe({
      next: (result) => {
        console.log('Login success:', result);

        const account = this.msalService.instance.getAllAccounts()[0];
        this.msalService.instance.setActiveAccount(account);
        this.isLoggedIn = true;
        sessionStorage.setItem('user', this.msalService.instance.getActiveAccount()?.username || '');
        sessionStorage.setItem('token', this.msalService.instance.getActiveAccount()?.idToken || '');
        this.router.navigate(['/patients']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.isLoggedIn = false;
      },
    });
  }


  logout() {
    this.msalService.logoutPopup().subscribe({
      next: () => {
        console.log('Logout success');
        this.isLoggedIn = false;

        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout error:', error);
      },
    });
  }
}
