import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Ritro",
  description: "What Ritro collects, why, who processes it, and how to delete it.",
};

const CONTACT = "minitjain.work@gmail.com";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="30 October 2026">
      <p>
        Ritro is a personal, non-commercial project run by Minit Jain, an individual based in
        India. This policy explains what data Ritro (the website at ritro.vercel.app and the Ritro
        browser extension) handles, why, and what you can do about it. Questions or requests:{" "}
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </p>

      <h2>What Ritro collects</h2>
      <ul>
        <li>
          <strong>Account details.</strong> Your email address and password (stored hashed by our
          auth provider). If you sign in with Google or GitHub, the basic profile that provider
          shares, such as your name and profile picture.
        </li>
        <li>
          <strong>What you save.</strong> The links you save, the title, description and preview
          image address Ritro reads from those pages, the tags (AI generated or added by you) and
          your collections.
        </li>
        <li>
          <strong>Preferences.</strong> Whether you opted out of the daily digest email, and your
          light or dark theme (stored only in your browser).
        </li>
        <li>
          <strong>Technical data.</strong> Request counters tied to your account for rate limiting,
          which expire within an hour, and standard server logs kept by our hosting provider, which
          can include your IP address and browser type.
        </li>
        <li>
          <strong>Usage statistics.</strong> Aggregated page views and page speed measurements
          through Vercel Web Analytics and Speed Insights. These don&apos;t use cookies and
          don&apos;t identify you across other sites.
        </li>
      </ul>
      <p>
        <strong>The browser extension</strong> stores your login tokens and email address in the
        extension&apos;s local storage on your device until you log out, which also ends the session
        on our auth provider. It doesn&apos;t keep a copy of your saves. It reads the address of the
        current tab only when you click save or use its keyboard shortcut, and it doesn&apos;t run on
        the pages you visit.
      </p>
      <p>Ritro does not sell your data, show ads, or use advertising or cross-site tracking.</p>

      <h2>Why it&apos;s used</h2>
      <ul>
        <li>To run your account and show you your saves (needed to provide the service).</li>
        <li>To suggest tags for what you save, using AI (part of the service).</li>
        <li>
          To send the daily digest of things you saved. Every email has a one-click unsubscribe
          link.
        </li>
        <li>To keep the service secure and prevent abuse, for example through rate limiting.</li>
        <li>To understand, in aggregate, how the site is used and how fast it loads.</li>
      </ul>
      <p>
        If you&apos;re in the EU or UK, the legal bases are performance of our agreement with you
        (running your account) and legitimate interests (security, the digest, aggregate
        statistics). You can object to any processing based on legitimate interests.
      </p>

      <h2>Who processes it</h2>
      <p>Ritro relies on these service providers, each bound by its own terms and privacy policy:</p>
      <ul>
        <li>
          <strong>Supabase</strong>: accounts and the database that stores your saves (hosted in
          Mumbai, India).
        </li>
        <li>
          <strong>Vercel</strong>: hosting, server logs and usage statistics (servers in the United
          States).
        </li>
        <li>
          <strong>Google Gemini API</strong>: receives the title and description of each page you
          save, to suggest tags. Ritro currently uses Gemini&apos;s free tier. Under Google&apos;s
          terms for that tier, Google may use this text to improve its products, and human
          reviewers may read it after it has been disconnected from Ritro&apos;s account. Don&apos;t
          rely on Ritro for pages whose titles or descriptions you consider sensitive.
        </li>
        <li>
          <strong>Upstash</strong>: rate limiting (counters tied to your account ID) and the queue
          that schedules tagging (bookmark IDs only).
        </li>
        <li>
          <strong>Resend</strong>: delivers the digest email, so it receives your email address and
          the saves listed in that email.
        </li>
        <li>
          <strong>Google and GitHub</strong>: only if you choose to sign in with them.
        </li>
      </ul>
      <p>
        When you save a link, Ritro&apos;s server visits that page to read its title, description and
        preview image. The site you saved sees a request from Ritro&apos;s server, not from you.
      </p>

      <h2>International transfers</h2>
      <p>
        Your data is stored in India and processed in the United States and other countries where
        these providers operate. Where the law requires it, transfers rely on the safeguards in the
        providers&apos; data processing terms, such as standard contractual clauses.
      </p>

      <h2>How long it&apos;s kept</h2>
      <p>
        Your account and saves are kept until you delete them or delete your account. Deleted bookmarks are removed from the database straight away. Rate-limit counters
        expire within an hour. Server logs are kept for the period set by the hosting provider.
      </p>

      <h2>Your rights</h2>
      <p>
        Wherever you live, you can access, correct, export or delete your data, and withdraw consent
        or object to processing. You can download all your data or delete your account and
        everything in it yourself, from <strong>Settings</strong> in the app. For anything else,
        email <a href={`mailto:${CONTACT}`}>{CONTACT}</a> from the address on your account and
        you&apos;ll get a reply within 30 days.
      </p>
      <ul>
        <li>
          <strong>EU and UK:</strong> you also have the right to restrict processing and to
          complain to your local data protection authority.
        </li>
        <li>
          <strong>India:</strong> you can raise a grievance at the email above. If it isn&apos;t
          resolved, you can approach the Data Protection Board of India.
        </li>
        <li>
          <strong>California and other US states:</strong> you have the right to know, delete and
          correct your data, and you won&apos;t be treated differently for using these rights.
          Ritro does not sell or share personal information as those laws define it.
        </li>
      </ul>

      <h2>Cookies and local storage</h2>
      <p>
        Ritro uses only cookies that are strictly necessary to keep you signed in. Your theme
        choice is stored in your browser&apos;s local storage. There are no advertising or tracking
        cookies, and the usage statistics don&apos;t use cookies, so there is no cookie banner.
      </p>

      <h2>Children</h2>
      <p>
        Ritro is not meant for anyone under 18. If you believe a child has created an account,
        email us and it will be deleted.
      </p>

      <h2>Security</h2>
      <p>
        Data travels over encrypted connections, passwords are stored hashed, and database rules
        restrict each account to its own data. No system is completely secure, so if you find a
        problem, please report it to the email above.
      </p>

      <h2>Open source</h2>
      <p>
        Ritro&apos;s code is public on{" "}
        <a href="https://github.com/ritrolabs/ritro">GitHub</a> under the GNU AGPL-3.0 licence, so
        you can check how your data is handled.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes, the date at the top will change. Significant changes will be
        announced on the site or by email before they take effect.
      </p>
    </LegalPage>
  );
}
