import React, { useState } from 'react';
import type { VerifiableCredential } from '../types';
import { ShieldCheckIcon, CertificateIcon } from './icons/Icons';

interface ShareModalProps {
  credential: VerifiableCredential;
  onClose: () => void;
  onConfirm: (recipient: string, expiry: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ credential, onClose, onConfirm }) => {
  const [recipient, setRecipient] = useState('');
  const [expiry, setExpiry] = useState('24 hours');

  const handleConfirmClick = () => {
    if (recipient) {
      onConfirm(recipient, expiry);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center mb-4">
          <ShieldCheckIcon className="w-8 h-8 text-teal-500 ml-3"/>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">مشاركة آمنة للبيانات</h2>
            <p className="text-gray-600 dark:text-gray-400">أنت المتحكم في بياناتك.</p>
          </div>
        </div>

        <div className="my-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <p className="font-semibold flex items-center"><CertificateIcon className="w-5 h-5 ml-2 text-teal-500"/>الشهادة المراد مشاركتها:</p>
            <p className="text-gray-700 dark:text-gray-300">{credential.type} من {credential.issuer}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              المستلم (طبيب، عيادة، إلخ)
            </label>
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="مثال: د. أحمد أو دراسة بحثية #123"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
          </div>
          <div>
            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              منح صلاحية الوصول لمدة
            </label>
            <select
              id="expiry"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="24 hours">24 ساعة</option>
              <option value="3 days">3 أيام</option>
              <option value="1 week">أسبوع واحد</option>
              <option value="1 month">شهر واحد</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            إلغاء
          </button>
          <button
            onClick={handleConfirmClick}
            disabled={!recipient}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            تأكيد ومشاركة
          </button>
        </div>
      </div>
    </div>
  );
};
