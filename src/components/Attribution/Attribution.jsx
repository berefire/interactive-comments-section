function Attribution({colorText="text-grey-500", colorLink="text-purple-600"}) {
  return (
    <footer className={`${colorText} font-body text-center text-xs`}>
      Challenge by{' '}
      <a
        href="https://www.frontendmentor.io?ref=challenge"
        className={`${colorLink} hover:underline focus-ring rounded-lg`}
      >
        Frontend Mentor <span
          aria-hidden="true" className="external-icon">🔗</span>
      </a>
      . Coded by{' '}
      <a
        href="https://github.com/berefire"
        className={`${colorLink} hover:underline focus-ring rounded-sm`}
      >
        Berefire
      </a>
      .
    </footer>
  );
}

export default Attribution;