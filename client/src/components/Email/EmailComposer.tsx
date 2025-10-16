import { useState } from 'react';
import { X, Send, Loader2, Mail } from 'lucide-react';
import emailService, { SendEmailData } from '../../services/emailService';
import toast from 'react-hot-toast';

interface EmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTo?: string;
  customerId?: string;
  leadId?: string;
  dealId?: string;
  onSuccess?: () => void;
}

export const EmailComposer = ({
  isOpen,
  onClose,
  defaultTo = '',
  customerId,
  leadId,
  dealId,
  onSuccess,
}: EmailComposerProps) => {
  const [to, setTo] = useState(defaultTo);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!to || !subject || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    setSending(true);

    try {
      const emailData: SendEmailData = {
        to,
        subject,
        message: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            ${message.replace(/\n/g, '<br>')}
            <br><br>
            <p>Best regards,<br><strong>The BharatNet CRM Team</strong></p>
          </div>
        `,
        customerId,
        leadId,
        dealId,
        type: 'custom',
      };

      await emailService.sendEmail(emailData);
      toast.success('Email sent successfully!');
      
      // Reset form
      setTo('');
      setSubject('');
      setMessage('');
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to send email:', error);
      toast.error('Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <div className="flex items-center space-x-2">
              <Mail className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Compose Email
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSend} className="p-6">
            <div className="space-y-4">
              {/* To Field */}
              <div>
                <label
                  htmlFor="to"
                  className="block text-sm font-medium text-gray-700"
                >
                  To
                </label>
                <input
                  type="email"
                  id="to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="recipient@example.com"
                  required
                />
              </div>

              {/* Subject Field */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="Enter email subject"
                  required
                />
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={10}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="Type your message here..."
                  required
                />
              </div>

              {/* Info Box */}
              <div className="rounded-md bg-blue-50 p-4">
                <p className="text-sm text-blue-700">
                  💡 Tip: Your email will be professionally formatted with your
                  company signature automatically.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={sending}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Email</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
