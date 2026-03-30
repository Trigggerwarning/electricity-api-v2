const request = require('supertest');
const app = require('../index');

describe('Electricity API Endpoints', () => {
    // Valid cases (6)
    it('should return total electricity usage for all years', async () => {
        const res = await request(app).get('/api/usage/total-by-year');
        expect(res.status).toBe(200);
        expect(typeof res.body).toBe('object');
        expect(Object.keys(res.body).length).toBeGreaterThan(0);
    });

    it('should return total electricity users for all years', async () => {
        const res = await request(app).get('/api/users/total-by-year');
        expect(res.status).toBe(200);
        expect(typeof res.body).toBe('object');
        expect(Object.keys(res.body).length).toBeGreaterThan(0);
    });

    it('should return usage data for Bangkok in 2566', async () => {
        const res = await request(app).get('/api/usage/Bangkok/2566');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('province_name', 'Bangkok');
        expect(res.body).toHaveProperty('year', 2566);
        expect(res.body).toHaveProperty('residential_kwh');
        expect(res.body.residential_kwh).toBeGreaterThan(0);
    });

    it('should return users data for Bangkok in 2566', async () => {
        const res = await request(app).get('/api/users/Bangkok/2566');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('province_name', 'Bangkok');
        expect(res.body).toHaveProperty('year', 2566);
        expect(res.body).toHaveProperty('residential_count');
        expect(res.body.residential_count).toBeGreaterThan(0);
    });

    it('should return usage history array for Bangkok', async () => {
        const res = await request(app).get('/api/usage-history/Bangkok');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should return users history array for Bangkok', async () => {
        const res = await request(app).get('/api/users-history/Bangkok');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    // Invalid cases (6)
    it('should return Data not found for non-existent usage province/year', async () => {
        const res = await request(app).get('/api/usage/Atlantis/9999');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Data not found' });
    });

    it('should return Data not found for non-existent users province/year', async () => {
        const res = await request(app).get('/api/users/Atlantis/9999');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Data not found' });
    });

    it('should return 404 for usage endpoint missing year', async () => {
        const res = await request(app).get('/api/usage/Bangkok');
        expect(res.status).toBe(404);
    });

    it('should return 404 for users endpoint missing year', async () => {
        const res = await request(app).get('/api/users/Bangkok');
        expect(res.status).toBe(404);
    });

    it('should return 404 for invalid totals route', async () => {
        const res = await request(app).get('/api/usage/total-year');
        expect(res.status).toBe(404);
    });

    it('should return 404 for completely unknown endpoint', async () => {
        const res = await request(app).get('/api/unknown-endpoint');
        expect(res.status).toBe(404);
    });
});