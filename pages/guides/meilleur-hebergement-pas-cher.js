import DecisionPage from '../../components/DecisionPage';
import { getDecisionPageStaticProps } from '../../lib/decision-page-props';

export async function getStaticProps() {
  return getDecisionPageStaticProps('meilleur-hebergement-pas-cher');
}

export default DecisionPage;
