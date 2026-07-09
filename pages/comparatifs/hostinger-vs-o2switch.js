import DecisionPage from '../../components/DecisionPage';
import { getDecisionPageStaticProps } from '../../lib/decision-page-props';

export async function getStaticProps() {
  return getDecisionPageStaticProps('hostinger-vs-o2switch');
}

export default DecisionPage;
