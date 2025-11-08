import React from 'react';
import type { VerifiableCredential } from '../types';
import { CertificateIcon, ShareIcon, LockIcon } from './icons/Icons';

interface CredentialCardProps {
  credential: VerifiableCredential;
  onShare: (credential: VerifiableCredential) => void;
  onRevoke: (id: string) => void;
}

export const CredentialCard: React.FC<CredentialCardProps> = ({ credential, onShare, onRevoke }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 flex flex-col justify-between border border-gray-200 dark:border-gray-600 shadow-sm transition hover:shadow-md">
      <div>
        <div className="flex items-center mb-2">
          <CertificateIcon className="w-6 h-6 text-teal-500 ml-2" />
          <h3 className="font-bold text-gray-800 dark:text-white">{credential.type}</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">جهة الإصدار: {credential.issuer}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">التاريخ: {credential.date}</p>
      </div>
      <div className="mt-4">
        {credential.sharedWith ? (
          <div className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-xs p-2 rounded-md">
            <p><strong>تمت المشاركة مع:</strong> {credential.sharedWith.recipient}</p>
            <p><strong>تنتهي الصلاحية:</strong> {credential.sharedWith.expiry}</p>
            <button
              onClick={() => onRevoke(credential.id)}
              className="mt-2 text-red-600 dark:text-red-400 hover:underline font-semibold text-xs flex items-center"
            >
              <LockIcon className="w-3 h-3 ml-1" />
              إلغاء الوصول
            </button>
          </div>
        ) : (
          <button
            onClick={() => onShare(credential)}
            className="w-full bg-teal-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center text-sm"
          >
            <ShareIcon className="w-4 h-4 ml-2" />
            مشاركة آمنة
          </button>
        )}
      </div>
    </div>
  );
};
