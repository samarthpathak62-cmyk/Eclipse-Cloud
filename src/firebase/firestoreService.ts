import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './config';
import {
  WebsiteSettings,
  DiscordSettings,
  HomepageConfig,
  HostingPlan,
  PlanCategory,
  FeatureItem,
  FaqItem,
  ReviewItem,
  Announcement,
  SocialLinks,
  UserProfile,
  AdminUser,
  AdminRoleDefinition,
  OrderRequest,
  SupportTicket,
  AppNotification,
  ActivityLog,
  AuditLog,
} from '../types';
import {
  INITIAL_WEBSITE_SETTINGS,
  INITIAL_DISCORD_SETTINGS,
  INITIAL_HOMEPAGE_CONFIG,
  INITIAL_CATEGORIES,
  INITIAL_PLANS,
  INITIAL_FEATURES,
  INITIAL_FAQS,
  INITIAL_REVIEWS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SOCIAL_LINKS,
  DEFAULT_ROLES,
} from './seedData';

// Document IDs for singleton configurations
const SETTINGS_DOC_ID = 'main';
const DISCORD_DOC_ID = 'main';
const HOMEPAGE_DOC_ID = 'main';
const SOCIAL_DOC_ID = 'main';

/**
 * Ensures seed data exists in Firestore upon initial load.
 */
export async function initializeSeedDataIfNeeded(): Promise<void> {
  try {
    const settingsRef = doc(db, 'websiteSettings', SETTINGS_DOC_ID);
    const settingsSnap = await getDoc(settingsRef);

    if (!settingsSnap.exists()) {
      console.log('Seeding initial website configuration to Firestore...');
      // Seed website settings
      await setDoc(settingsRef, INITIAL_WEBSITE_SETTINGS);

      // Seed discord settings
      await setDoc(doc(db, 'discordSettings', DISCORD_DOC_ID), INITIAL_DISCORD_SETTINGS);

      // Seed homepage configuration
      await setDoc(doc(db, 'homepageConfig', HOMEPAGE_DOC_ID), INITIAL_HOMEPAGE_CONFIG);

      // Seed social links
      await setDoc(doc(db, 'socialLinks', SOCIAL_DOC_ID), INITIAL_SOCIAL_LINKS);

      // Seed roles
      for (const role of DEFAULT_ROLES) {
        await setDoc(doc(db, 'roles', role.id), role);
      }

      // Seed categories
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'planCategories', cat.id), cat);
      }

      // Seed plans
      for (const plan of INITIAL_PLANS) {
        await setDoc(doc(db, 'plans', plan.id), plan);
      }

      // Seed features
      for (const feat of INITIAL_FEATURES) {
        await setDoc(doc(db, 'features', feat.id), feat);
      }

      // Seed FAQs
      for (const faq of INITIAL_FAQS) {
        await setDoc(doc(db, 'faqs', faq.id), faq);
      }

      // Seed Reviews
      for (const rev of INITIAL_REVIEWS) {
        await setDoc(doc(db, 'reviews', rev.id), rev);
      }

      // Seed Announcements
      for (const ann of INITIAL_ANNOUNCEMENTS) {
        await setDoc(doc(db, 'announcements', ann.id), ann);
      }

      // Seed initial activity log
      await setDoc(doc(db, 'activityLogs', 'initial-seed'), {
        id: 'initial-seed',
        actorId: 'system',
        actorEmail: 'system@novacraft-hosting.com',
        actorRole: 'Owner',
        action: 'System Initialized',
        details: 'Initial database schemas, hosting plans, and default CMS configuration seeded successfully.',
        timestamp: new Date().toISOString(),
      });

      console.log('Firestore seed data successfully initialized.');
    }
  } catch (error) {
    console.warn('initializeSeedDataIfNeeded encountered an error (using fallback defaults):', error);
  }
}

// ---------------- WEBSITE & DISCORD SETTINGS ----------------

export async function fetchWebsiteSettings(): Promise<WebsiteSettings> {
  try {
    const snap = await getDoc(doc(db, 'websiteSettings', SETTINGS_DOC_ID));
    if (snap.exists()) {
      return snap.data() as WebsiteSettings;
    }
  } catch (err) {
    console.warn('Error fetching website settings:', err);
  }
  return INITIAL_WEBSITE_SETTINGS;
}

export async function saveWebsiteSettings(
  settings: WebsiteSettings,
  actorEmail = 'Admin'
): Promise<void> {
  await setDoc(doc(db, 'websiteSettings', SETTINGS_DOC_ID), settings);
  await logActivity(actorEmail, 'Owner', 'Website Settings Updated', `Updated branding for ${settings.websiteName}`);
}

export async function fetchDiscordSettings(): Promise<DiscordSettings> {
  try {
    const snap = await getDoc(doc(db, 'discordSettings', DISCORD_DOC_ID));
    if (snap.exists()) {
      return snap.data() as DiscordSettings;
    }
  } catch (err) {
    console.warn('Error fetching discord settings:', err);
  }
  return INITIAL_DISCORD_SETTINGS;
}

export async function saveDiscordSettings(
  settings: DiscordSettings,
  actorEmail = 'Admin'
): Promise<void> {
  await setDoc(doc(db, 'discordSettings', DISCORD_DOC_ID), settings);
  await logActivity(actorEmail, 'Owner', 'Discord Settings Updated', `Updated Discord invites to: ${settings.mainInviteUrl}`);
}

export async function fetchHomepageConfig(): Promise<HomepageConfig> {
  try {
    const snap = await getDoc(doc(db, 'homepageConfig', HOMEPAGE_DOC_ID));
    if (snap.exists()) {
      return snap.data() as HomepageConfig;
    }
  } catch (err) {
    console.warn('Error fetching homepage config:', err);
  }
  return INITIAL_HOMEPAGE_CONFIG;
}

export async function saveHomepageConfig(
  config: HomepageConfig,
  actorEmail = 'Admin'
): Promise<void> {
  await setDoc(doc(db, 'homepageConfig', HOMEPAGE_DOC_ID), config);
  await logActivity(actorEmail, 'Admin', 'Homepage CMS Updated', 'Modified hero, section headings, or visibility');
}

export async function fetchSocialLinks(): Promise<SocialLinks> {
  try {
    const snap = await getDoc(doc(db, 'socialLinks', SOCIAL_DOC_ID));
    if (snap.exists()) {
      return snap.data() as SocialLinks;
    }
  } catch (err) {
    console.warn('Error fetching social links:', err);
  }
  return INITIAL_SOCIAL_LINKS;
}

export async function saveSocialLinks(links: SocialLinks, actorEmail = 'Admin'): Promise<void> {
  await setDoc(doc(db, 'socialLinks', SOCIAL_DOC_ID), links);
  await logActivity(actorEmail, 'Admin', 'Social Links Updated', 'Updated external social media profiles');
}

// ---------------- PLANS & CATEGORIES ----------------

export async function fetchPlans(): Promise<HostingPlan[]> {
  try {
    const q = query(collection(db, 'plans'), orderBy('displayOrder', 'asc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => d.data() as HostingPlan);
    }
  } catch (err) {
    console.warn('Error fetching plans from Firestore, using initial:', err);
  }
  return INITIAL_PLANS;
}

export async function savePlan(plan: HostingPlan, actorEmail = 'Admin'): Promise<void> {
  const planId = plan.id || `plan-${Date.now()}`;
  const planData: HostingPlan = {
    ...plan,
    id: planId,
    updatedDate: new Date().toISOString(),
  };
  await setDoc(doc(db, 'plans', planId), planData);
  await logActivity(actorEmail, 'Admin', 'Plan Saved', `Created or updated plan: ${plan.name} (${plan.ram})`);
}

export async function deletePlanDoc(planId: string, actorEmail = 'Admin'): Promise<void> {
  await deleteDoc(doc(db, 'plans', planId));
  await logActivity(actorEmail, 'Admin', 'Plan Deleted', `Deleted plan ID: ${planId}`);
}

export async function fetchCategories(): Promise<PlanCategory[]> {
  try {
    const q = query(collection(db, 'planCategories'), orderBy('displayOrder', 'asc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => d.data() as PlanCategory);
    }
  } catch (err) {
    console.warn('Error fetching categories from Firestore:', err);
  }
  return INITIAL_CATEGORIES;
}

export async function saveCategory(category: PlanCategory, actorEmail = 'Admin'): Promise<void> {
  const catId = category.id || `cat-${Date.now()}`;
  const data: PlanCategory = { ...category, id: catId };
  await setDoc(doc(db, 'planCategories', catId), data);
  await logActivity(actorEmail, 'Admin', 'Category Saved', `Saved plan category: ${category.name}`);
}

export async function deleteCategoryDoc(catId: string, actorEmail = 'Admin'): Promise<void> {
  await deleteDoc(doc(db, 'planCategories', catId));
  await logActivity(actorEmail, 'Admin', 'Category Deleted', `Deleted category ID: ${catId}`);
}

// ---------------- FEATURES, FAQS, REVIEWS, ANNOUNCEMENTS ----------------

export async function fetchFeatures(): Promise<FeatureItem[]> {
  try {
    const snap = await getDocs(collection(db, 'features'));
    if (!snap.empty) {
      const items = snap.docs.map(d => d.data() as FeatureItem);
      return items.sort((a, b) => a.displayOrder - b.displayOrder);
    }
  } catch (err) {
    console.warn('Error fetching features:', err);
  }
  return INITIAL_FEATURES;
}

export async function saveFeature(feature: FeatureItem, actorEmail = 'Admin'): Promise<void> {
  const id = feature.id || `feat-${Date.now()}`;
  await setDoc(doc(db, 'features', id), { ...feature, id });
  await logActivity(actorEmail, 'Admin', 'Feature Saved', `Saved feature: ${feature.title}`);
}

export async function deleteFeatureDoc(id: string, actorEmail = 'Admin'): Promise<void> {
  await deleteDoc(doc(db, 'features', id));
  await logActivity(actorEmail, 'Admin', 'Feature Deleted', `Deleted feature ID: ${id}`);
}

export async function fetchFaqs(): Promise<FaqItem[]> {
  try {
    const snap = await getDocs(collection(db, 'faqs'));
    if (!snap.empty) {
      const items = snap.docs.map(d => d.data() as FaqItem);
      return items.sort((a, b) => a.displayOrder - b.displayOrder);
    }
  } catch (err) {
    console.warn('Error fetching FAQs:', err);
  }
  return INITIAL_FAQS;
}

export async function saveFaq(faq: FaqItem, actorEmail = 'Admin'): Promise<void> {
  const id = faq.id || `faq-${Date.now()}`;
  await setDoc(doc(db, 'faqs', id), { ...faq, id });
  await logActivity(actorEmail, 'Admin', 'FAQ Saved', `Saved FAQ: ${faq.question}`);
}

export async function deleteFaqDoc(id: string, actorEmail = 'Admin'): Promise<void> {
  await deleteDoc(doc(db, 'faqs', id));
  await logActivity(actorEmail, 'Admin', 'FAQ Deleted', `Deleted FAQ ID: ${id}`);
}

export async function fetchReviews(): Promise<ReviewItem[]> {
  try {
    const snap = await getDocs(collection(db, 'reviews'));
    if (!snap.empty) {
      const items = snap.docs.map(d => d.data() as ReviewItem);
      return items.sort((a, b) => a.displayOrder - b.displayOrder);
    }
  } catch (err) {
    console.warn('Error fetching reviews:', err);
  }
  return INITIAL_REVIEWS;
}

export async function saveReview(review: ReviewItem, actorEmail = 'Admin'): Promise<void> {
  const id = review.id || `rev-${Date.now()}`;
  await setDoc(doc(db, 'reviews', id), { ...review, id });
  await logActivity(actorEmail, 'Admin', 'Review Saved', `Saved review by: ${review.authorName}`);
}

export async function deleteReviewDoc(id: string, actorEmail = 'Admin'): Promise<void> {
  await deleteDoc(doc(db, 'reviews', id));
  await logActivity(actorEmail, 'Admin', 'Review Deleted', `Deleted review ID: ${id}`);
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  try {
    const snap = await getDocs(collection(db, 'announcements'));
    if (!snap.empty) {
      return snap.docs.map(d => d.data() as Announcement);
    }
  } catch (err) {
    console.warn('Error fetching announcements:', err);
  }
  return INITIAL_ANNOUNCEMENTS;
}

export async function saveAnnouncement(ann: Announcement, actorEmail = 'Admin'): Promise<void> {
  const id = ann.id || `ann-${Date.now()}`;
  await setDoc(doc(db, 'announcements', id), { ...ann, id });
  await logActivity(actorEmail, 'Admin', 'Announcement Saved', `Saved announcement: ${ann.title}`);
}

export async function deleteAnnouncementDoc(id: string, actorEmail = 'Admin'): Promise<void> {
  await deleteDoc(doc(db, 'announcements', id));
  await logActivity(actorEmail, 'Admin', 'Announcement Deleted', `Deleted announcement ID: ${id}`);
}

// ---------------- ORDERS / INQUIRIES (DISCORD-BASED) ----------------

export async function recordPlanOrderInquiry(order: Omit<OrderRequest, 'id' | 'createdAt'>): Promise<string> {
  const id = `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const orderDoc: OrderRequest = {
    ...order,
    id,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'orders', id), orderDoc);
    await logActivity(order.userEmail, 'User', 'Plan Order Intent Created', `Selected ${order.planName} (${order.planRam}) to order on Discord`);
  } catch (err) {
    console.warn('Could not record order request in Firestore:', err);
  }
  return id;
}

export async function fetchOrders(userId?: string): Promise<OrderRequest[]> {
  try {
    const q = userId
      ? query(collection(db, 'orders'), where('userId', '==', userId))
      : collection(db, 'orders');
    const snap = await getDocs(q);
    const orders = snap.docs.map(d => d.data() as OrderRequest);
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.warn('Error fetching orders:', err);
    return [];
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderRequest['status'],
  actorEmail = 'Admin'
): Promise<void> {
  await updateDoc(doc(db, 'orders', orderId), { status });
  await logActivity(actorEmail, 'Admin', 'Order Status Changed', `Order ${orderId} status set to ${status}`);
}

// ---------------- USERS & ADMIN ROLES ----------------

export async function fetchAllUsers(): Promise<UserProfile[]> {
  try {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => d.data() as UserProfile);
  } catch (err) {
    console.warn('Error fetching users:', err);
    return [];
  }
}

export async function updateUserDisabledState(userId: string, disabled: boolean, actorEmail = 'Admin'): Promise<void> {
  await updateDoc(doc(db, 'users', userId), { disabled });
  await logActivity(actorEmail, 'Admin', 'User Status Toggled', `User ${userId} disabled status: ${disabled}`);
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  try {
    const snap = await getDocs(collection(db, 'admins'));
    return snap.docs.map(d => d.data() as AdminUser);
  } catch (err) {
    console.warn('Error fetching admins:', err);
    return [];
  }
}

export async function setAdminRecord(admin: AdminUser, actorEmail = 'Owner'): Promise<void> {
  await setDoc(doc(db, 'admins', admin.uid), admin);
  await logActivity(actorEmail, 'Owner', 'Admin Assigned', `Assigned role ${admin.role} to ${admin.email}`);
}

export async function removeAdminRecord(adminUid: string, actorEmail = 'Owner'): Promise<void> {
  await deleteDoc(doc(db, 'admins', adminUid));
  await logActivity(actorEmail, 'Owner', 'Admin Removed', `Removed admin privilege for UID ${adminUid}`);
}

export async function fetchRoles(): Promise<AdminRoleDefinition[]> {
  try {
    const snap = await getDocs(collection(db, 'roles'));
    if (!snap.empty) {
      return snap.docs.map(d => d.data() as AdminRoleDefinition);
    }
  } catch (err) {
    console.warn('Error fetching roles:', err);
  }
  return DEFAULT_ROLES;
}

export async function saveRole(role: AdminRoleDefinition, actorEmail = 'Owner'): Promise<void> {
  await setDoc(doc(db, 'roles', role.id), role);
  await logActivity(actorEmail, 'Owner', 'Role Updated', `Updated permissions for role ${role.name}`);
}

// ---------------- NOTIFICATIONS ----------------

export async function fetchNotifications(userId?: string): Promise<AppNotification[]> {
  try {
    const snap = await getDocs(collection(db, 'notifications'));
    let notifs = snap.docs.map(d => d.data() as AppNotification);
    if (userId) {
      notifs = notifs.filter(n => n.target === 'all' || n.userId === userId);
    }
    return notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.warn('Error fetching notifications:', err);
    return [];
  }
}

export async function broadcastNotification(
  notif: Omit<AppNotification, 'id' | 'createdAt'>,
  actorEmail = 'Admin'
): Promise<void> {
  const id = `notif-${Date.now()}`;
  const data: AppNotification = {
    ...notif,
    id,
    createdAt: new Date().toISOString(),
  };
  await setDoc(doc(db, 'notifications', id), data);
  await logActivity(actorEmail, 'Admin', 'Notification Broadcasted', `Sent "${notif.title}" to target: ${notif.target}`);
}

// ---------------- SUPPORT TICKETS / INQUIRIES ----------------

export async function createSupportTicket(
  ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>
): Promise<string> {
  const id = `ticket-${Date.now()}`;
  const data: SupportTicket = {
    ...ticket,
    id,
    status: 'Open',
    createdAt: new Date().toISOString(),
    responses: [],
  };
  await setDoc(doc(db, 'tickets', id), data);
  await logActivity(ticket.userEmail, 'User', 'Support Inquiry Created', `Opened ticket: ${ticket.subject}`);
  return id;
}

export async function fetchTickets(userId?: string): Promise<SupportTicket[]> {
  try {
    const q = userId
      ? query(collection(db, 'tickets'), where('userId', '==', userId))
      : collection(db, 'tickets');
    const snap = await getDocs(q);
    const tickets = snap.docs.map(d => d.data() as SupportTicket);
    return tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.warn('Error fetching tickets:', err);
    return [];
  }
}

export function subscribeToUserTickets(
  userId: string,
  onUpdate: (tickets: SupportTicket[]) => void
): () => void {
  try {
    const q = query(collection(db, 'tickets'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const tickets = snap.docs.map(d => d.data() as SupportTicket);
        tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onUpdate(tickets);
      },
      (err) => {
        console.warn('Real-time tickets listener error (falling back to fetch):', err);
        fetchTickets(userId).then(onUpdate);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Error initiating ticket subscription:', err);
    fetchTickets(userId).then(onUpdate);
    return () => {};
  }
}

export async function addTicketResponse(
  ticketId: string,
  response: { sender: string; senderRole: string; message: string },
  newStatus?: SupportTicket['status']
): Promise<void> {
  const ticketRef = doc(db, 'tickets', ticketId);
  const snap = await getDoc(ticketRef);
  if (snap.exists()) {
    const current = snap.data() as SupportTicket;
    const newResponses = [
      ...(current.responses || []),
      {
        id: `resp-${Date.now()}`,
        ...response,
        timestamp: new Date().toISOString(),
      },
    ];
    const updatePayload: Record<string, any> = {
      responses: newResponses,
      updatedAt: new Date().toISOString(),
    };
    if (newStatus) {
      updatePayload.status = newStatus;
    } else if (response.senderRole === 'User' && (current.status === 'Answered' || current.status === 'Resolved')) {
      updatePayload.status = 'Open';
    } else if (response.senderRole === 'Admin' || response.senderRole === 'Support') {
      updatePayload.status = 'Answered';
    }
    await updateDoc(ticketRef, updatePayload);
  }
}

export async function updateTicketStatus(
  ticketId: string,
  status: SupportTicket['status'],
  actorEmail = 'Admin'
): Promise<void> {
  await updateDoc(doc(db, 'tickets', ticketId), { status });
  await logActivity(actorEmail, 'Support', 'Ticket Status Changed', `Ticket ${ticketId} set to ${status}`);
}

// ---------------- ACTIVITY & AUDIT LOGS ----------------

export async function logActivity(
  actorEmail: string,
  actorRole: string,
  action: string,
  details: string
): Promise<void> {
  try {
    const id = `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const log: ActivityLog = {
      id,
      actorId: actorEmail,
      actorEmail,
      actorRole,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    await setDoc(doc(db, 'activityLogs', id), log);
  } catch (e) {
    // Non-blocking log write
  }
}

export async function fetchActivityLogs(max = 50): Promise<ActivityLog[]> {
  try {
    const q = query(collection(db, 'activityLogs'), orderBy('timestamp', 'desc'), limit(max));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => d.data() as ActivityLog);
    }
  } catch (err) {
    console.warn('Error fetching activity logs:', err);
  }
  return [];
}

export async function logAudit(
  actorEmail: string,
  action: string,
  targetCollection: string,
  documentId: string,
  previousValue?: any,
  newValue?: any
): Promise<void> {
  try {
    const id = `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const audit: AuditLog = {
      id,
      actorId: actorEmail,
      actorEmail,
      action,
      targetCollection,
      documentId,
      previousValue: previousValue ? JSON.stringify(previousValue) : undefined,
      newValue: newValue ? JSON.stringify(newValue) : undefined,
      timestamp: new Date().toISOString(),
    };
    await setDoc(doc(db, 'auditLogs', id), audit);
  } catch (e) {
    // Non-blocking
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
}

export async function fetchAdmins(): Promise<AdminUser[]> {
  return fetchAdminUsers();
}

export async function saveAdminDoc(admin: AdminUser, actorEmail = 'Owner'): Promise<void> {
  return setAdminRecord(admin, actorEmail);
}

export async function deleteAdminDoc(adminUid: string, actorEmail = 'Owner'): Promise<void> {
  return removeAdminRecord(adminUid, actorEmail);
}

export async function createNotification(
  notif: Partial<AppNotification> & { title: string; message: string }
): Promise<void> {
  const id = `notif-${Date.now()}`;
  const data: AppNotification = {
    id,
    title: notif.title,
    message: notif.message,
    type: notif.type || 'info',
    target: notif.targetUserId ? notif.targetUserId : 'all',
    targetUserId: notif.targetUserId,
    targetUserEmail: notif.targetUserEmail,
    createdAt: new Date().toISOString(),
  };
  await setDoc(doc(db, 'notifications', id), data);
}

export async function deleteNotificationDoc(id: string): Promise<void> {
  await deleteDoc(doc(db, 'notifications', id));
}

export async function fetchAuditLogs(max = 50): Promise<AuditLog[]> {
  try {
    const q = query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(max));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => d.data() as AuditLog);
    }
  } catch (err) {
    console.warn('Error fetching audit logs:', err);
  }
  return [];
}
