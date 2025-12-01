import React from 'react';
import MainLayout from '../layouts/MainLayout';

export default function MentionsLegalesPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Mentions Légales</h1>

        {/* Section 1 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Informations légales</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Le site <span className="font-semibold">www.zoonova.fr</span> est édité par <span className="font-semibold">NACREALE, SAS</span> enregistrée au registre du commerce et des sociétés de Bobigny sous le numéro <span className="font-semibold">517 466 058</span>.
            </p>
            <p>
              Son siège social se trouve au <span className="font-semibold">5 rue George Sand, 93430 Villetaneuse</span>
            </p>
            <p>
              <span className="font-semibold">Éditeur du site :</span> NACREALE Editions.
            </p>
            <p>
              <span className="font-semibold">Directrice de la publication :</span> Nacreale Editions
            </p>
            <p>
              <span className="font-semibold">Hébergement :</span> IONOS
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Service Client</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <span className="font-semibold">Contact :</span> <a href="mailto:hello@zoonova.fr" className="text-primary hover:text-secondary transition">hello@zoonova.fr</a>
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Protection des données personnelles</h2>
          <div className="space-y-6 text-gray-700">
            <div>
              <p>
                Conformément à la loi informatique et libertés N° 78-17 du 06 janvier 1978, vous pouvez à tout moment modifier ou supprimer les renseignements liés à votre inscription. Ces informations vous concernant sont confidentielles, le propriétaire du site s'engage donc à les protéger. Vous disposez d'un droit d'accès, de modification, de rectification et de suppression des données qui vous concernent (art. 34 de la loi « Informatique et Libertés »). Vous pouvez exercer ce droit directement sur le site ou en nous contactant aux coordonnées indiquées ci-dessus.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-primary p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Loi RGPD</h3>
              <p className="mb-4">
                Pour vous permettre d'acheter sur <span className="font-semibold">www.zoonova.fr</span>, nous devons collecter votre nom, email, adresse ainsi que votre numéro de téléphone. Le 25 mai 2018 est entré en vigueur le Règlement général sur la Protection des Données (règlement européen n° 2016/679).
              </p>
              <p className="mb-4">
                Dans le cadre de ce nouveau règlement, <span className="font-semibold">NACREALE ÉDITIONS</span> vous confirme que vos données personnelles ne sont <span className="font-bold text-primary">JAMAIS</span> transmises à des tiers, car confidentielles.
              </p>
              <p>
                Notre base de données ne servira <span className="font-bold text-primary">JAMAIS</span> à des fins commerciales, et ne sera <span className="font-bold text-primary">JAMAIS</span> échangée, vendue ni cédée.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Cookies</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              L'utilisateur est informé, lors de ses visites sur le site qu'un cookie peut s'installer automatiquement sur son logiciel de navigation. Il ne servira pas à l'identifier, mais à enregistrer des informations relatives à sa navigation sur le site internet afin de lui faciliter sa navigation. Toutefois, l'utilisateur pourra désactiver ce cookie en effectuant les paramétrages dans son propre logiciel de navigation. L'utilisateur dispose d'un droit d'accès, de rectification ou de suppression des données personnelles communiquées par le biais des cookies.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Propriété intellectuelle</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Tous les éléments du site sont et restent la propriété intellectuelle et exclusive de <span className="font-semibold">NACREALE ÉDITIONS</span>. Toute reproduction, exploitation, rediffusion ou utilisation à quelque titre que ce soit, même partiellement, des éléments du site qu'ils soient logiciels, visuels ou sonores est formellement interdit ; sans un accord explicite de <span className="font-semibold">NACREALE ÉDITIONS</span>.
            </p>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-gray-50 p-8 rounded-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Des questions ?</h3>
          <p className="text-gray-700 mb-4">
            Pour toute question concernant nos mentions légales ou la protection de vos données, veuillez nous contacter à l'adresse suivante :
          </p>
          <a href="mailto:hello@zoonova.fr" className="text-primary hover:text-secondary font-semibold transition">
            hello@zoonova.fr
          </a>
        </section>
      </div>
    </MainLayout>
  );
}
