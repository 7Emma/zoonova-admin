import React from 'react';
import MainLayout from '../layouts/MainLayout';

export default function ConditionsVentesPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Conditions de Ventes</h1>
        <p className="text-gray-600 text-lg mb-12">NACREALE ÉDITIONS</p>

        {/* Section 1 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Objet</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Les présentes conditions générales de vente s'appliquent à toute commande passée sur le site Internet <span className="font-semibold">www.zoonova.fr</span>.
            </p>
            <p>
              <span className="font-semibold">NACREALE ÉDITIONS</span> se réserve le droit de les adapter ou les modifier sans préavis. En cas de modification, ce sont ces nouvelles conditions générales de vente qui seront appliquées à chaque nouvelle commande.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Disponibilité des produits</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Nos produits sont valables dans la limite des stocks disponibles. À réception de votre commande, nous vérifions leurs disponibilités.
            </p>
            <p>
              En cas d'indisponibilité, nous nous engageons dans les <span className="font-semibold">30 jours</span> à compter de la passation de la commande à faire le nécessaire pour vous livrer le produit commandé. À défaut, nous vous proposerons un produit similaire à un prix similaire, ou nous vous rembourserons.
            </p>
            <p>
              La date de validation de la commande correspond à la date de l'acceptation de votre commande. En cas de rupture de stock sur l'un des produits de votre commande, nous vous le ferons savoir et expédierons le reste de votre commande, dans le délai maximum susmentionné de 30 jours.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Prix</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Nos prix exprimés en euros TTC s'entendent <span className="font-semibold">hors frais de transport</span>. Le client qui passe la commande devra s'en acquitter, sauf s'il bénéficie d'une offre spéciale l'en exonérant.
            </p>
            <p>
              <span className="font-semibold">NACREALE ÉDITIONS</span> se réserve le droit de modifier ses prix sans préavis, notamment en cas d'augmentation des charges, du taux de TVA ou en cas d'erreur éditrice.
            </p>
            <p>
              Cependant, ce sont toujours les tarifs qui vous auront été indiqués au moment de votre commande (sous réserve de disponibilité des produits à cette date) qui seront ceux en vigueur.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Paiement et sécurité</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Les utilisateurs peuvent effectuer le règlement de leurs commandes par les moyens suivants : <span className="font-semibold">Carte Bleue, Carte Visa, Carte American Express et Carte MasterCard</span>.
            </p>
            <div className="bg-blue-50 border-l-4 border-primary p-4">
              <p className="font-semibold mb-2">Sécurité du paiement :</p>
              <p className="mb-3">
                Les données des cartes crédit sont cryptées en <span className="font-semibold">SSL 128 (Secure Socket Layer)</span>. Ils ne transitent donc jamais en clair sur le réseau et le paiement est directement effectué auprès de la banque.
              </p>
              <p className="mb-3">
                <span className="font-semibold">NACREALE ÉDITIONS n'a pas accès à ces données, et ne les garde pas sur ses serveurs</span>. C'est la raison pour laquelle nous vous les redemandons à chaque nouvelle commande.
              </p>
            </div>
            <p>
              Les produits demeurent la propriété de <span className="font-semibold">NACREALE ÉDITIONS</span> jusqu'à leurs paiements intégraux. Toutefois dès la livraison, les risques des marchandises livrées sont transférés au client.
            </p>
            <p>
              <span className="font-semibold">NACREALE ÉDITIONS</span> se réserve le droit, en cas de défaut de paiement, de refuser d'effectuer une livraison ou d'honorer une commande émanant d'un client utilisateur n'ayant pas réglé totalement ou partiellement une commande précédente ; voir avec lequel un litige de paiement subsiste.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Livraison</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <span className="font-semibold">NACREALE ÉDITIONS</span> s'engagent à livrer les commandes sans délai. Elles seront acheminées par les services postaux qui seront tenus à leurs propres délais de livraison.
            </p>
            <p>
              Par conséquent <span className="font-semibold">NACREALE ÉDITIONS</span> ne pourra pas être tenues responsables d'éventuels retards de livraison. Idem lorsque le client/utilisateur commet une erreur dans le libellé de son adresse, entraînant un retard de distribution au niveau des services postaux.
            </p>
            <p>
              Si la commande était retournée à <span className="font-semibold">NACREALE ÉDITIONS</span>, le client/utilisateur accepte que les frais de réexpédition lui soient (re)facturés.
            </p>
            <p className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              Si d'aventure la commande arrivait défectueuse, l'utilisateur/client dispose d'un délai de <span className="font-semibold">48 heures</span> pour faire sa réclamation auprès <span className="font-semibold">NACREALE ÉDITIONS</span>. Il sera ainsi procédé à l'échange du produit concerné.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Responsabilités</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <span className="font-semibold">NACREALE ÉDITIONS</span> ne saura pas tenu responsable de la non-exécution du contrat de vente en cas de force majeure ou fortuit (inondations, incendies, tempête, etc.) de grève des services postaux et de perturbation des moyens de transport et/ou de communications.
            </p>
            <p>
              L'utilisateur client est le seul responsable de sa volonté d'achat sur <span className="font-semibold">www.zoonova.fr</span>. Il ne pourra faire grief d'un préjudice ouvrant droit à un quelconque dédommagement s'il ne pouvait après son achat en faire l'usage auquel le produit est destiné.
            </p>
            <p>
              Lorsqu'un produit commandé est non livré, ou livré avec des produits manquants, l'acheteur doit se manifester dans un délai de <span className="font-semibold">30 jours</span> (à compter de la date de la passation de commande). Au-delà de ce délai <span className="font-semibold">NACREALE ÉDITIONS</span> ne pourra accepter aucune réclamation.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Rétractation</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <span className="font-semibold">NACREALE ÉDITIONS</span> accorde à l'utilisateur un délai de <span className="font-semibold">14 jours ouvrables</span> à compter de la réception des produits commandés pour retourner à ses frais ceux qui ne lui conviendraient pas.
            </p>
            <p>
              Il doit cependant communiquer au préalable cette volonté de retour à l'adresse mail : <a href="mailto:hello@zoonova.fr" className="text-primary hover:text-secondary font-semibold transition">hello@zoonova.fr</a>
            </p>
            <p className="bg-orange-50 border-l-4 border-orange-500 p-4">
              <span className="font-semibold">Important :</span> Les produits retournés doivent être à l'état neuf. En effet, tout produit détérioré, incomplet ou sali ne sera ni repris ni échangé.
            </p>
            <p>
              Après réception du produit retourné à l'état neuf par vos soins, <span className="font-semibold">NACREALE ÉDITIONS</span> s'engage à vous faire un échange dans un délai maximum de <span className="font-semibold">30 jours</span>.
            </p>
          </div>
        </section>

        {/* Section 8 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Informations légales</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Pour traiter, acheminer et facturer les commandes passées par le l'utilisateur / acheteur, il est nécessaire que nous collections les informations nominatives aux fins de rendre possible ce contrat de vente à distance. Par conséquent, le défaut de renseignement entraîne la non-validation de la commande.
            </p>
            <p>
              Conformément à la loi "Informatique et Libertés", le traitement des informations nominatives relatives aux clients a fait l'objet d'une déclaration auprès de la <span className="font-semibold">Commission Nationale de l'Informatique et des Libertés (CNIL)</span>.
            </p>
            <p>
              De même, le client utilisateur dispose d'un droit d'accès, de modification, de rectification et de suppression des données le concernant, qu'il peut exercer auprès de <span className="font-semibold">NACREALE ÉDITIONS</span> (article 34 de la loi du 6 janvier 1978).
            </p>
            <p className="bg-blue-50 border-l-4 border-primary p-4 font-semibold text-primary">
              NACREALE ÉDITIONS s'engage à ne pas communiquer ou céder les coordonnées de ses clients à un tiers, de manière gratuite ou avec contrepartie.
            </p>
          </div>
        </section>

        {/* Section 9 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Droits applicables</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Les présentes conditions générales de vente sont régies par la <span className="font-semibold">loi française</span>.
            </p>
            <p>
              En cas de difficultés dans l'application du présent contrat, <span className="font-semibold">NACREALE ÉDITIONS</span> favorisera une démarche amiable avec le client acheteur avant toute action en justice.
            </p>
            <p>
              À défaut de conciliation, le <span className="font-semibold">Tribunal de Commerce de Paris</span> sera seul compétent pour arbitrer, quels que soient le lieu de livraison et le mode de paiement accepté.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gray-900 text-white p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Questions ?</h3>
          <p className="mb-4">Pour toute question ou réclamation concernant ces conditions de ventes :</p>
          <a href="mailto:hello@zoonova.fr" className="text-primary hover:text-secondary font-semibold transition text-lg">
            hello@zoonova.fr
          </a>
        </section>
      </div>
    </MainLayout>
  );
}
