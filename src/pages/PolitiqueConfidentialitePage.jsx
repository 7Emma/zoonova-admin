import React from 'react';
import MainLayout from '../layouts/MainLayout';

export default function PolitiqueConfidentialitePage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Politique de Confidentialité</h1>

        <section className="mb-12">
          <div className="space-y-6 text-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Collecte et utilisation des données</h2>
              <p>
                NACREALE ÉDITIONS s'engage à protéger votre vie privée. Pour traiter, acheminer et facturer les commandes passées sur le site www.zoonova.fr, il est nécessaire que nous collections les informations nominatives suivantes :
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Adresse postale</li>
                <li>Numéro de téléphone</li>
              </ul>
              <p className="mt-4">
                Ces informations sont nécessaires pour rendre possible le contrat de vente à distance. Le défaut de renseignement entraîne la non-validation de la commande.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-primary p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Loi "Informatique et Libertés"</h3>
              <p className="mb-4">
                Conformément à la loi "Informatique et Libertés" du 6 janvier 1978, le traitement des informations nominatives relatives aux clients a fait l'objet d'une déclaration auprès de la <span className="font-semibold">Commission Nationale de l'Informatique et des Libertés (CNIL)</span>.
              </p>
              <p>
                De même, vous disposez d'un droit d'accès, de modification, de rectification et de suppression des données vous concernant, que vous pouvez exercer auprès de NACREALE ÉDITIONS (article 34 de la loi du 6 janvier 1978).
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-primary p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Règlement Général sur la Protection des Données (RGPD)</h3>
              <p className="mb-4">
                Depuis le 25 mai 2018, le Règlement général sur la Protection des Données (règlement européen n° 2016/679) s'applique.
              </p>
              <p className="mb-4">
                <span className="font-bold text-primary">NACREALE ÉDITIONS vous confirme que vos données personnelles ne sont JAMAIS transmises à des tiers</span>, car elles sont confidentielles.
              </p>
              <p className="mb-4">
                Notre base de données ne servira <span className="font-bold text-primary">JAMAIS</span> à des fins commerciales, et ne sera <span className="font-bold text-primary">JAMAIS</span> échangée, vendue ni cédée.
              </p>
              <p>
                <span className="font-semibold">NACREALE ÉDITIONS s'engage à ne pas communiquer ou céder les coordonnées de ses clients à un tiers</span>, de manière gratuite ou avec contrepartie.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Droits d'accès et de suppression</h3>
              <p>
                Vous disposez d'un droit d'accès, de modification, de rectification et de suppression des données personnelles qui vous concernent. Vous pouvez exercer ce droit directement sur le site ou en nous contactant à l'adresse suivante :
              </p>
              <p className="mt-3">
                <a href="mailto:hello@zoonova.fr" className="text-primary hover:text-secondary font-semibold transition">
                  hello@zoonova.fr
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cookies</h3>
              <p>
                Lors de vos visites sur le site www.zoonova.fr, un cookie peut s'installer automatiquement sur votre logiciel de navigation. Il ne servira pas à vous identifier, mais à enregistrer des informations relatives à votre navigation sur le site internet afin de vous faciliter votre navigation.
              </p>
              <p className="mt-3">
                Vous pouvez désactiver ce cookie en effectuant les paramétrages dans votre propre logiciel de navigation. Vous disposez d'un droit d'accès, de rectification ou de suppression des données personnelles communiquées par le biais des cookies.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sécurité des paiements</h3>
              <p>
                Vos données bancaires ne sont jamais conservées ou traitées par nos serveurs. Les données de cartes crédit sont cryptées en <span className="font-semibold">SSL 128 (Secure Socket Layer)</span> et transitent de manière sécurisée directement auprès de la banque.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nous contacter</h3>
              <p className="text-gray-700 mb-3">
                Pour toute question concernant votre confidentialité ou l'utilisation de vos données :
              </p>
              <a href="mailto:hello@zoonova.fr" className="text-primary hover:text-secondary font-semibold transition">
                hello@zoonova.fr
              </a>
            </div>
          </div>
        </section>

        {/* Last Updated */}
        <div className="text-center text-gray-500 text-sm">
          <p>Dernière mise à jour : 2024</p>
        </div>
      </div>
    </MainLayout>
  );
}
