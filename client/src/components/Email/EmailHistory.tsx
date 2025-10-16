import { useEffect, useState } from 'react';
import { Mail, Clock, CheckCircle, XCircle, Eye, MousePointerClick } from 'lucide-react';
import emailService, { Email } from '../../services/emailService';
import { formatDistanceToNow } from 'date-fns';

interface EmailHistoryProps {
  customerId?: string;
  leadId?: string;
  dealId?: string;
}

export const EmailHistory = ({ customerId, leadId, dealId }: EmailHistoryProps) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  useEffect(() => {
    fetchEmails();
  }, [customerId, leadId, dealId]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const data = await emailService.getEmailHistory({
        customerId,
        leadId,
        dealId,
        limit: 50,
      });
      setEmails(data.emails);
    } catch (error) {
      console.error('Failed to fetch email history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'opened':
        return <Eye className="h-5 w-5 text-blue-500" />;
      case 'clicked':
        return <MousePointerClick className="h-5 w-5 text-purple-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      welcome: 'bg-green-100 text-green-800',
      followup: 'bg-blue-100 text-blue-800',
      invoice: 'bg-yellow-100 text-yellow-800',
      campaign: 'bg-purple-100 text-purple-800',
      custom: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || colors.custom;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <Mail className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No emails yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Send your first email to this contact.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {emails.map((email) => (
        <div
          key={email._id}
          className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setSelectedEmail(email)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="mt-1">{getStatusIcon(email.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {email.subject}
                  </h4>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getTypeColor(
                      email.type
                    )}`}
                  >
                    {email.type}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  To: {email.to.join(', ')}
                </p>
                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                  <span>
                    {formatDistanceToNow(new Date(email.sentAt || email.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <span>•</span>
                  <span>{getStatusText(email.status)}</span>
                  {email.openedAt && (
                    <>
                      <span>•</span>
                      <span className="text-blue-600">
                        Opened {formatDistanceToNow(new Date(email.openedAt), { addSuffix: true })}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Email Preview Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setSelectedEmail(null)}
            />
            <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl">
              <div className="border-b p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedEmail.subject}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  To: {selectedEmail.to.join(', ')}
                </p>
              </div>
              <div className="p-6">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
                />
              </div>
              <div className="border-t p-6 flex justify-end">
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
