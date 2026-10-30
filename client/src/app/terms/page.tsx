import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | Ritro",
  description: "The terms for using Ritro, a free personal bookmarking project.",
};

const CONTACT = "minitjain.work@gmail.com";

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="30 October 2026">
      <p>
        These terms apply to the Ritro website at ritro.vercel.app and the Ritro browser extension
        (together, &quot;Ritro&quot;). Ritro is a free, personal, non-commercial project run by Minit
        Jain, an individual based in India. By creating an account or using Ritro, you agree to
        these terms and to the <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>Who can use Ritro</h2>
      <p>
        You must be at least 18 and able to agree to these terms. Keep your login details safe;
        you&apos;re responsible for what happens in your account.
      </p>

      <h2>Your content</h2>
      <p>
        You own what you save. You give Ritro permission to store, process and display it only as
        needed to run the service for you, including sending page titles and descriptions to an AI
        provider to suggest tags, as described in the Privacy Policy. The pages you save belong to
        their owners; saving a link doesn&apos;t give you or Ritro any rights to that content.
      </p>

      <h2>Acceptable use</h2>
      <p>Don&apos;t use Ritro to:</p>
      <ul>
        <li>break the law or infringe anyone&apos;s rights;</li>
        <li>store or share content that is illegal, abusive or exploits anyone;</li>
        <li>
          attack, overload or probe the service, get around its limits, or access other
          people&apos;s data;
        </li>
        <li>scrape the service or use it to send automated traffic to other sites.</li>
      </ul>
      <p>Accounts that break these rules may be suspended or deleted.</p>

      <h2>AI suggestions</h2>
      <p>
        Tags are generated automatically and can be wrong or incomplete. Check anything that
        matters to you.
      </p>

      <h2>The service is provided as is</h2>
      <p>
        Ritro is free and maintained by one person. It may change, have downtime, lose features or
        shut down, and there is no guarantee that it will be available or that data will never be
        lost. Keep your own copy of anything important. If Ritro shuts down, users will be given
        reasonable notice where possible, with a way to export their saves.
      </p>
      <p>
        To the extent the law allows, Ritro is provided without warranties of any kind, and Minit
        Jain is not liable for indirect or consequential losses, or for any loss above what you
        paid to use Ritro (which is nothing). Nothing in these terms limits rights that the law
        says can&apos;t be limited, including your rights as a consumer where you live.
      </p>

      <h2>Open-source code</h2>
      <p>
        Ritro&apos;s source code is available on{" "}
        <a href="https://github.com/ritrolabs/ritro">GitHub</a> under the GNU AGPL-3.0 licence. That
        licence, not these terms, governs your use of the code. These terms govern your use of the
        hosted service.
      </p>

      <h2>Ending your use</h2>
      <p>
        You can stop using Ritro at any time and ask for your account to be deleted by emailing{" "}
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        If these terms change, the date at the top will change. Significant changes will be
        announced before they take effect. Using Ritro after that means you accept the new terms.
      </p>

      <h2>Law</h2>
      <p>
        These terms are governed by the laws of India. If you live in a country whose consumer laws
        give you the right to bring claims in your local courts, you keep that right.
      </p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
      </p>
    </LegalPage>
  );
}
