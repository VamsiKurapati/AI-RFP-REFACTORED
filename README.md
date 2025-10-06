# RFP Management Application

A comprehensive React-based Request for Proposal (RFP) management system with AI-powered solutions for streamlining proposal creation, compliance checking, and project management.

## 🚀 Features

### Core Functionality
- **AI-Powered Proposal Generation**: Automated RFP response creation with intelligent content generation
- **Compliance Checking**: Basic and advanced compliance verification for proposals
- **User Management**: Role-based access control (Company, Editor, Viewer, SuperAdmin)
- **Profile Management**: Separate company and employee profile systems
- **Dashboard**: Comprehensive project and proposal management interface
- **Payment Integration**: Stripe-powered subscription and payment processing

### User Roles
- **Company**: Full access to all features, profile management, and team oversight
- **Editor**: Proposal creation and editing capabilities
- **Viewer**: Read-only access to proposals and compliance checks
- **SuperAdmin**: System administration and user management

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── admin/           # Admin-specific components
│   │   ├── Card.jsx
│   │   ├── PricingCard.jsx
│   │   └── ShowCustomDetails.jsx
│   ├── forms/           # Form components
│   │   ├── GrantProposalForm.jsx
│   │   └── PhoneNumberInput.jsx
│   ├── layout/          # Layout components
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   └── NavbarComponent.jsx
│   ├── ui/              # UI components
│   │   ├── Generate_Word.jsx
│   │   ├── PaymentButton.jsx
│   │   ├── PaymentNavigation.jsx
│   │   ├── Subscription.jsx
│   │   └── ToastContainer.jsx
│   └── ErrorBoundary.jsx
├── config/              # Configuration files
│   └── stripe.js
├── context/             # React Context providers
│   ├── EmployeeProfileContext.jsx
│   ├── JWTVerifier.jsx
│   ├── ProfileContext.jsx
│   ├── SubscriptionPlansContext.jsx
│   └── UserContext.jsx
├── pages/               # Page components
│   ├── admin/           # Admin pages
│   │   └── SuperAdmin.jsx
│   ├── auth/            # Authentication pages
│   │   ├── ChangePassword.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfileForm.jsx
│   │   └── SignUpPage.jsx
│   ├── dashboard/       # Dashboard pages
│   │   ├── Dashboard.jsx
│   │   └── Discover.jsx
│   ├── profile/         # Profile management pages
│   │   ├── CompanyProfileDashboard.jsx
│   │   ├── CompanyProfileUpdate.jsx
│   │   ├── EmployeeProfileDashboard.jsx
│   │   └── EmployeeProfileUpdate.jsx
│   ├── proposals/       # Proposal-related pages
│   │   ├── AdvancedComplianceCheck.jsx
│   │   ├── BasicComplianceCheck.jsx
│   │   ├── Compliance.jsx
│   │   ├── GenerateProposalPage.jsx
│   │   └── Proposals.jsx
│   ├── Contact.jsx
│   ├── HomePage.jsx
│   ├── ProtectedRoutes.jsx
│   ├── StripePaymentPage.jsx
│   └── SupportTicket.jsx
├── utils/               # Utility functions
│   ├── compression.js
│   └── sanitization.js
├── assets/              # Static assets
└── App.jsx              # Main application component
```

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - UI library
- **Vite** - Build tool and development server
- **React Router DOM 7.6.2** - Client-side routing
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **React Hook Form 7.57.0** - Form management
- **Axios 1.9.0** - HTTP client

### UI Components & Icons
- **Lucide React 0.525.0** - Icon library
- **React Icons 5.5.0** - Additional icons
- **React Select 5.10.1** - Select components
- **React Toastify 11.0.5** - Toast notifications
- **SweetAlert2 11.22.4** - Beautiful alerts

### Document & PDF Processing
- **React PDF 7.0.0** - PDF rendering
- **PDF-lib 1.17.1** - PDF manipulation
- **HTML2PDF.js 0.10.3** - HTML to PDF conversion
- **jsPDF 3.0.1** - PDF generation
- **Quill 2.0.3** - Rich text editor

### Payment & Authentication
- **Stripe React 3.9.2** - Payment processing
- **JWT Decode 4.0.0** - JWT token handling
- **LibPhoneNumber 1.12.9** - Phone number validation

### State Management & Utilities
- **Redux Toolkit 2.8.2** - State management
- **React Redux 9.2.0** - React-Redux bindings
- **Moment.js 2.30.1** - Date manipulation
- **UUID 11.1.0** - Unique identifier generation
- **DOMPurify 3.2.7** - XSS protection

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rfp-app-new
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_API_BASE_URL=your_api_base_url
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication & Authorization

The application implements role-based access control with the following roles:

### Company Role
- Full access to all features
- Company profile management
- Team member management
- Proposal creation and management
- Payment and subscription management

### Editor Role
- Proposal creation and editing
- Basic compliance checking
- Profile management (employee)
- Access to dashboard and discovery

### Viewer Role
- Read-only access to proposals
- Basic compliance checking
- Profile management (employee)
- Limited dashboard access

### SuperAdmin Role
- System administration
- User management
- Analytics and reporting
- System configuration

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: Theme switching capability
- **Accessibility**: WCAG compliant components
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: Comprehensive error boundaries
- **Toast Notifications**: User feedback system

## 📊 Key Features

### Proposal Management
- **AI-Powered Generation**: Automated proposal content creation
- **Template System**: Reusable proposal templates
- **Version Control**: Track proposal changes and versions
- **Collaboration**: Multi-user editing capabilities

### Compliance Checking
- **Basic Compliance**: Automated rule checking
- **Advanced Compliance**: AI-powered compliance analysis
- **Custom Rules**: Configurable compliance requirements
- **Audit Trail**: Complete compliance history

### Dashboard & Analytics
- **Project Overview**: Visual project management
- **Calendar Integration**: Schedule and deadline tracking
- **Performance Metrics**: Proposal success rates
- **Team Analytics**: User activity and productivity

## 🔧 Configuration

### Stripe Integration
Configure Stripe payments in `src/config/stripe.js`:
```javascript
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
```

### API Configuration
All API calls are configured through environment variables:
- `VITE_API_BASE_URL`: Backend API base URL
- Additional API endpoints are defined in individual components

## 🧪 Testing

The project includes testing setup with:
- **React Testing Library**: Component testing
- **Jest**: Test runner and assertions
- **User Event**: User interaction testing

Run tests with:
```bash
npm test
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the project: `npm run build`
2. Upload the `dist` folder to your hosting provider
3. Configure server to serve the SPA correctly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation wiki

## 🔄 Version History

- **v1.0.0** - Initial release with core RFP management features
- **v1.1.0** - Added AI-powered proposal generation
- **v1.2.0** - Enhanced compliance checking system
- **v1.3.0** - Improved UI/UX and mobile responsiveness

---

**Built with ❤️ using React and modern web technologies**