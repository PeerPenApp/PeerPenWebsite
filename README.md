# PeerPen 🖊️

**Write together. Get in alone.**

The social feedback platform for college essays. Built by students, for students.

<p align="center">
  <img src="public/logo_light.png" alt="PeerPen Logo" width="200">
</p>

## About

PeerPen is a revolutionary platform designed to help students craft compelling college essays through collaborative feedback and peer review. Our mission is to democratize access to high-quality essay feedback, making the college application process more accessible and successful for students everywhere.

### Why PeerPen?

- **🤝 Collaborative Learning**: Get feedback from peers who understand your journey
- **📝 Expert Guidance**: Access proven essay writing techniques and strategies
- **🎯 Targeted Feedback**: Receive specific, actionable advice to improve your essays
- **⚡ Real-time Updates**: Track your progress and see improvements instantly
- **🔒 Privacy First**: Your essays and feedback are secure and confidential

## Features

- **Modern, Responsive Design**: Beautiful UI that works on all devices
- **Email Waitlist System**: Join our community and get early access
- **SEO Optimized**: Built for discoverability and performance
- **Fast & Lightweight**: Built with Astro for optimal performance
- **Accessible**: Designed with accessibility in mind

## Tech Stack

- **Framework**: [Astro](https://astro.build/) - Fast, modern web framework
- **Styling**: Custom CSS with modern design principles
- **Email Service**: [Buttondown](https://buttondown.email/) - Newsletter management
- **Deployment**: Ready for Vercel, Netlify, or any static hosting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/peerpen-website.git
   cd peerpen-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   BUTTONDOWN_API_KEY=your_buttondown_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:4321`

## Configuration

### Site Settings

Update your site configuration in `src/data/settings.ts`:

```typescript
export const settings = {
  site: 'https://peerpen.com',
  name: 'PeerPen',
  title: 'PeerPen | Write together. Get in alone.',
  description: 'The social feedback platform for college essays. Built by students, for students.',
}
```

### Email Integration

The waitlist form is integrated with Buttondown. To set up:

1. Create an account at [buttondown.email](https://buttondown.email)
2. Get your API key from the dashboard
3. Add it to your `.env` file
4. The form will automatically collect emails and add them to your newsletter

## Development

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.astro    # Button component
│   ├── SignupForm.astro # Waitlist form with Buttondown integration
│   └── ...
├── data/               # Site configuration
├── layouts/            # Page layouts
├── pages/              # Route pages
└── styles/             # Global styles
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Astro and deploy
3. Add your environment variables in the Vercel dashboard

### Netlify

1. Connect your repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Other Platforms

Astro works with any static hosting platform. See the [Astro deployment guide](https://docs.astro.build/en/guides/deploy/) for more options.

## Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Test your changes thoroughly
- Update documentation as needed
- Keep commits descriptive and focused

## Roadmap

- [ ] User authentication system
- [ ] Essay submission and review interface
- [ ] Real-time collaboration features
- [ ] Expert review marketplace
- [ ] Mobile app development
- [ ] Advanced analytics and insights

## Support

- **Email**: hello@peerpen.com
- **Discord**: [Join our community](https://discord.gg/peerpen)
- **Twitter**: [@peerpen](https://twitter.com/peerpen)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with ❤️ by students, for students
- Inspired by the need for better college essay feedback
- Powered by the amazing open-source community

---

**Ready to revolutionize your college essay writing? [Join the waitlist](https://peerpen.com) today!**
