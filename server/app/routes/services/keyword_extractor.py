import re
from typing import Dict, List, Any
from collections import Counter
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

class KeywordExtractor:
    def __init__(self):
        """Initialize keyword extractor with predefined keyword categories"""
        try:
            nltk.download('punkt', quiet=True)
            nltk.download('stopwords', quiet=True)
            self.stop_words = set(stopwords.words('english'))
        except:
            # Fallback stop words if NLTK download fails
            self.stop_words = {
                'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
                'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
                'to', 'was', 'will', 'with', 'would'
            }
        
        # Predefined keyword categories
        self.technical_skills = {
            'programming_languages': [
                'python', 'javascript', 'java', 'c++', 'c#', 'php', 'ruby',
                'swift', 'kotlin', 'go', 'rust', 'typescript', 'scala'
            ],
            'web_technologies': [
                'html', 'css', 'react', 'angular', 'vue.js', 'node.js',
                'express', 'django', 'flask', 'spring', 'laravel'
            ],
            'databases': [
                'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite',
                'oracle', 'sql server', 'cassandra', 'elasticsearch'
            ],
            'cloud_platforms': [
                'aws', 'azure', 'google cloud', 'gcp', 'heroku',
                'digitalocean', 'kubernetes', 'docker'
            ],
            'tools_frameworks': [
                'git', 'jenkins', 'docker', 'kubernetes', 'terraform',
                'ansible', 'webpack', 'gulp', 'maven', 'gradle'
            ]
        }
        
        self.soft_skills = [
            'leadership', 'communication', 'teamwork', 'problem solving',
            'analytical thinking', 'creativity', 'adaptability', 'time management',
            'project management', 'critical thinking', 'collaboration',
            'customer service', 'presentation skills', 'negotiation'
        ]
        
        self.industry_keywords = {
            'software_development': [
                'agile', 'scrum', 'ci/cd', 'devops', 'microservices',
                'api development', 'testing', 'debugging', 'code review'
            ],
            'data_science': [
                'machine learning', 'data analysis', 'statistics',
                'data visualization', 'deep learning', 'nlp', 'big data'
            ],
            'business': [
                'strategy', 'analysis', 'optimization', 'roi',
                'stakeholder management', 'budget management'
            ]
        }

    def extract_technical_keywords(self, text: str) -> Dict[str, List[str]]:
        """Extract technical keywords by category"""
        text_lower = text.lower()
        found_keywords = {}
        
        for category, keywords in self.technical_skills.items():
            found = []
            for keyword in keywords:
                if keyword in text_lower:
                    found.append(keyword)
            if found:
                found_keywords[category] = found
        
        return found_keywords

    def extract_soft_skills(self, text: str) -> List[str]:
        """Extract soft skills from text"""
        text_lower = text.lower()
        found_skills = []
        
        for skill in self.soft_skills:
            if skill in text_lower:
                found_skills.append(skill)
        
        return found_skills

    def extract_industry_keywords(self, text: str) -> Dict[str, List[str]]:
        """Extract industry-specific keywords"""
        text_lower = text.lower()
        found_keywords = {}
        
        for industry, keywords in self.industry_keywords.items():
            found = []
            for keyword in keywords:
                if keyword in text_lower:
                    found.append(keyword)
            if found:
                found_keywords[industry] = found
        
        return found_keywords

    def extract_custom_keywords(self, text: str, min_length: int = 3) -> List[str]:
        """Extract custom keywords using frequency analysis"""
        try:
            # Tokenize text
            tokens = word_tokenize(text.lower())
        except:
            # Fallback tokenization
            tokens = re.findall(r'\b\w+\b', text.lower())
        
        # Filter tokens
        filtered_tokens = [
            token for token in tokens 
            if token not in self.stop_words 
            and len(token) >= min_length
            and token.isalpha()
        ]
        
        # Count frequency
        token_freq = Counter(filtered_tokens)
        
        # Return most common tokens (excluding very common ones)
        common_words = {'experience', 'work', 'years', 'team', 'project', 'company'}
        keywords = [
            word for word, freq in token_freq.most_common(20)
            if word not in common_words and freq >= 2
        ]
        
        return keywords[:10]  # Return top 10

    def analyze_keyword_density(self, text: str, keywords: List[str]) -> Dict[str, Any]:
        """Analyze keyword density in the text"""
        word_count = len(text.split())
        keyword_counts = {}
        total_keyword_occurrences = 0
        
        text_lower = text.lower()
        
        for keyword in keywords:
            count = text_lower.count(keyword.lower())
            if count > 0:
                keyword_counts[keyword] = {
                    'count': count,
                    'density': round((count / word_count) * 100, 2)
                }
                total_keyword_occurrences += count
        
        overall_density = round((total_keyword_occurrences / word_count) * 100, 2)
        
        return {
            'overall_density': overall_density,
            'keyword_details': keyword_counts,
            'total_keywords': len(keyword_counts),
            'density_rating': self.rate_density(overall_density)
        }

    def rate_density(self, density: float) -> str:
        """Rate keyword density"""
        if density < 2:
            return "Low - Consider adding more relevant keywords"
        elif density <= 5:
            return "Optimal - Good keyword usage"
        elif density <= 8:
            return "High - Consider reducing keyword repetition"
        else:
            return "Very High - May appear as keyword stuffing"

    def suggest_missing_keywords(self, found_keywords: Dict[str, Any], industry: str = "technology") -> List[str]:
        """Suggest missing keywords based on industry"""
        suggestions = []
        
        # Get all found technical keywords
        all_found = []
        if 'technical' in found_keywords:
            for category_keywords in found_keywords['technical'].values():
                all_found.extend(category_keywords)
        
        # Suggest missing important keywords
        important_keywords = {
            'technology': [
                'git', 'api', 'database', 'testing', 'agile', 'scrum',
                'problem solving', 'debugging', 'optimization'
            ],
            'business': [
                'analysis', 'strategy', 'roi', 'stakeholder management',
                'project management', 'communication', 'leadership'
            ],
            'marketing': [
                'analytics', 'campaign management', 'seo', 'social media',
                'content creation', 'market research', 'branding'
            ]
        }
        
        industry_keywords = important_keywords.get(industry, important_keywords['technology'])
        
        for keyword in industry_keywords:
            if keyword not in all_found:
                suggestions.append(keyword)
        
        return suggestions[:8]  # Return top 8 suggestions

    def extract_keywords(self, file_id: str) -> Dict[str, Any]:
        """Main keyword extraction function"""
        # For demo purposes, return mock analysis
        # In real implementation, this would load and analyze the actual file
        
        mock_text = """
        Senior Software Developer with 5+ years of experience in web development.
        Proficient in Python, JavaScript, React, and Node.js. Strong background
        in database design using PostgreSQL and MongoDB. Experience with AWS
        cloud services and Docker containerization. Excellent problem-solving
        skills and team leadership abilities.
        """
        
        technical_keywords = self.extract_technical_keywords(mock_text)
        soft_skills = self.extract_soft_skills(mock_text)
        industry_keywords = self.extract_industry_keywords(mock_text)
        custom_keywords = self.extract_custom_keywords(mock_text)
        
        # Combine all keywords for density analysis
        all_keywords = []
        for category_keywords in technical_keywords.values():
            all_keywords.extend(category_keywords)
        all_keywords.extend(soft_skills)
        for category_keywords in industry_keywords.values():
            all_keywords.extend(category_keywords)
        
        density_analysis = self.analyze_keyword_density(mock_text, all_keywords)
        suggestions = self.suggest_missing_keywords({
            'technical': technical_keywords,
            'soft_skills': soft_skills,
            'industry': industry_keywords
        })
        
        return {
            'technical_keywords': technical_keywords,
            'soft_skills': soft_skills,
            'industry_keywords': industry_keywords,
            'custom_keywords': custom_keywords,
            'density_analysis': density_analysis,
            'suggestions': suggestions,
            'total_unique_keywords': len(set(all_keywords)),
            'keyword_categories': {
                'technical': len([kw for cat in technical_keywords.values() for kw in cat]),
                'soft_skills': len(soft_skills),
                'industry': len([kw for cat in industry_keywords.values() for kw in cat]),
                'custom': len(custom_keywords)
            }
        }
