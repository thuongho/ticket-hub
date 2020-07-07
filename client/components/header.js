import Link from 'next/link';

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign in', href: '/auth/signin' },
    !currentUser && { label: 'Sign up', href: '/auth/signup' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    currentUser && { label: 'Sign out', href: '/auth/signout' }
  ]
    // filters out only truthy
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className='nav-item'>
          <Link href={href}>
            <a className='nav-link'>{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className='navbar navbar-light bg-dark' style={{ color: 'white' }}>
      <Link href='/'>
        <a className='navbar-brand' style={{ color: 'white' }}>
          TixWorld
        </a>
      </Link>

      <div className='d-flex justify-content-end'>
        <ul className='nav d-flex align-items-center'>{links}</ul>
      </div>
    </nav>
  );
};
