# Native Resource Hub - Data Files

This directory contains comprehensive CSV data files for importing into the Native Resource Hub database.

## Available Data Files

### 1. tribes-comprehensive.csv
**200+ federally recognized tribes** across all regions of the United States including:
- Tribe name
- Federal recognition status
- Official website
- Region (Southwest, Northwest, Great Plains, etc.)
- Enrollment office contact information
- Language preservation links

**Regions Covered:**
- Southwest (Arizona, New Mexico, Southern California, Utah, Nevada)
- Northwest (Washington, Oregon, Idaho, Northern California)
- Great Plains (Montana, Wyoming, North Dakota, South Dakota, Nebraska)
- Southern Plains (Oklahoma, Kansas, Texas)
- Northeast (New York, Wisconsin, Michigan)
- Southeast (North Carolina, Florida)
- Alaska

### 2. federal-resources-comprehensive.csv
**75+ resources** including:
- **Federal Programs** (50+): IHS, BIA, HUD, USDA, Department of Labor, EPA, and more
- **State Programs** (15+): Education and health programs from CA, OK, NM, WA, AZ, and more
- **Emergency Resources** (8+): Disaster relief, emergency assistance, LIHEAP
- **Tribal Programs** (3+): Navajo, Cherokee, Tohono O'odham housing programs

**Resource Categories:**
- Health & Medical Services
- Education (K-12, College, Vocational)
- Housing (Construction, Repair, Rental Assistance, Home Loans)
- Economic Development & Business
- Language & Cultural Preservation
- Employment & Job Training
- Food & Nutrition Assistance
- Infrastructure & Transportation
- Emergency Services
- Legal & Justice Services

### 3. scholarships-comprehensive.csv
**70+ scholarships** including:
- Major national programs (AICF, Catching the Dream, Gates, Cobell, etc.)
- Tribal-specific scholarships (Cherokee, Navajo, Chickasaw, Seminole, etc.)
- STEM-focused scholarships (AISES, Google, Adobe, NASA, etc.)
- Professional field scholarships (Healthcare, Business, Journalism, Arts, etc.)
- Graduate fellowships
- Internship opportunities

**Scholarship Types:**
- Undergraduate
- Graduate & PhD
- Tribal College
- High School
- K-12
- Vocational/Technical

## How to Import Data

### Option 1: Using the Admin Interface (Recommended)

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the admin interface:
   ```
   http://localhost:3000/admin/import-export
   ```

3. Select the data type (Resources, Scholarships, or Tribes)

4. Click "Choose File" and select one of the CSV files from this directory

5. Click "Import Data"

6. Review the import results (successful imports, failed imports, errors)

### Option 2: Using the Bulk Seed Script

You can also use the bulk-seed TypeScript script to programmatically import data:

```bash
tsx scripts/bulk-seed.ts
```

This script contains hardcoded data but can be modified to read from these CSV files.

### Option 3: Direct Database Import

If you prefer to import directly to your database:

```bash
# Make sure your DATABASE_URL environment variable is set
# Then use the Prisma client or a custom import script
```

## CSV File Format Specifications

### Tribes CSV Format
```csv
name,federalRecognitionStatus,website,region,enrollmentOffice,languageLinks
```

**Required Fields:**
- `name`: Tribe name (minimum 1 character)

**Optional Fields:**
- `federalRecognitionStatus`: Recognition status (e.g., "Federally Recognized")
- `website`: Official tribe website URL
- `region`: Geographic region
- `enrollmentOffice`: Contact information for enrollment
- `languageLinks`: Semicolon-separated URLs to language resources

### Resources CSV Format
```csv
type,title,description,url,eligibility,tags,state,tribeId,source
```

**Required Fields:**
- `type`: One of: federal, state, tribal, scholarship, emergency
- `title`: Resource title (minimum 1 character)
- `description`: Detailed description (minimum 1 character)

**Optional Fields:**
- `url`: Resource website URL
- `eligibility`: Semicolon-separated eligibility requirements
- `tags`: Semicolon-separated tags
- `state`: State name (for state-specific resources)
- `tribeId`: Tribe UUID (for tribal resources)
- `source`: Data source attribution

### Scholarships CSV Format
```csv
name,amount,deadline,description,tags,eligibility,url,source
```

**Required Fields:**
- `name`: Scholarship name (minimum 1 character)
- `description`: Detailed description (minimum 1 character)

**Optional Fields:**
- `amount`: Scholarship amount (e.g., "$5,000", "$1,000 - $10,000")
- `deadline`: Deadline in YYYY-MM-DD format (leave empty for rolling deadlines)
- `tags`: Semicolon-separated tags
- `eligibility`: Semicolon-separated eligibility requirements
- `url`: Application URL
- `source`: Scholarship provider/organization

## Data Sources

All data in these files has been compiled from official and publicly available sources:

- **Tribes**: Bureau of Indian Affairs Tribal Leaders Directory, tribal official websites
- **Federal Resources**: Federal agency websites (IHS, BIA, HUD, USDA, etc.)
- **State Resources**: State department websites
- **Scholarships**: Scholarship organization websites, tribal education departments

## Updating and Maintaining Data

To keep data current:

1. **Export existing data**: Use the admin export feature to download current data
2. **Edit in spreadsheet**: Open CSV in Excel, Google Sheets, or similar
3. **Make updates**: Add new entries, update deadlines, correct information
4. **Re-import**: Upload the updated CSV through the admin interface

## Data Quality Notes

- All URLs have been verified as of the file creation date
- Scholarship deadlines are approximate and should be verified on official websites
- Tribal contact information should be verified before use
- Some smaller or recently recognized tribes may not be included in the initial dataset

## Need More Data?

### To find all 574 federally recognized tribes:
- Visit the BIA Tribal Leaders Directory: https://www.bia.gov/service/tribal-leaders-directory
- Download the official Federal Register listing
- Use the web scraper script: `tsx scripts/web-scraper.ts tribes`

### To find more federal resources:
- Visit USA.gov Native Americans page: https://www.usa.gov/tribes
- Explore individual agency websites (IHS, BIA, HUD, etc.)
- Use the web scraper script: `tsx scripts/web-scraper.ts ihs`

### To find more scholarships:
- Visit scholarship aggregator sites
- Check individual tribal education department websites
- Contact tribal colleges and universities
- Use the web scraper script: `tsx scripts/web-scraper.ts scholarships`

## Contributing

If you'd like to contribute additional data:

1. Follow the CSV format specifications above
2. Ensure all URLs are valid and active
3. Verify information from official sources
4. Include source attribution
5. Submit via pull request or contact the maintainers

## Support

For questions or issues with data import:
- Check the admin interface for detailed error messages
- Verify CSV file format matches specifications
- Ensure all required fields are present
- Contact the development team for assistance

## License

This data compilation is provided for educational and resource directory purposes. Individual resources, programs, and scholarships are provided by their respective organizations. Please respect tribal sovereignty and follow proper protocols when contacting tribes or using this information.
