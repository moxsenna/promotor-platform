import { mockStore } from "@/adapters/mock/mock-state-store";
import { getPendingActionsForContact, mockNextActionAdapter } from "@/modules/next-action";

/**
 * TodayPage - Main container for /app route (Today view)
 * 
 * Implements F1 milestone: Core Contacts + NextAction display
 * Layout per design.md §7: page structure dengan row pattern
 * - Page Header
 * - Section title
 * - Rows (no cards)
 */
export async function TodayPage() {
  const contacts = mockStore.getContacts();

  // Wire in NextAction queries
  const contactsWithActions = await Promise.all(
    contacts.map(async (contact) => {
      const actions = await getPendingActionsForContact(
        contact.id,
        mockNextActionAdapter
      );
      return {
        ...contact,
        pendingActions: actions,
      };
    })
  );

  return (
    <div className="page-container">
      {/* Page Header */}
      <header className="page-header">
        <h1 className="page-title">Today</h1>
      </header>

      {/* Contact Section */}
      <section className="list-section">
        <h2 className="section-label">Contacts ({contacts.length})</h2>
        
        <ul className="row-list">
          {contactsWithActions.length === 0 ? (
            <li className="empty-row">No contacts found</li>
          ) : (
            contactsWithActions.map((item) => (
              <ContactRow key={item.id} contact={item} />
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

/**
 * ContactRow component - implements strict row pattern (NO card)
 * Per design.md §3.1: use list rows instead of decorative cards
 */
async function ContactRow({ contact }: { contact: any }) {
  const hasAction = contact.pendingActions?.length > 0;

  return (
    <li className="contact-row">
      <div className="row-content">
        <span className="row-name">{contact.name}</span>
        <span className="row-subtitle">{contact.phoneE164}</span>
      </div>
      
      {hasAction ? (
        <span className="row-status">
          ● {contact.pendingActions.length} action(s)
        </span>
      ) : (
        <span className="row-status row-status--done">Done</span>
      )}
    </li>
  );
}
