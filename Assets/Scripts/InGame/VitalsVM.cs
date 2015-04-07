using UnityEngine;
using System.Collections;
using Assets.Scripts;
using UnityEngine.UI;

public class VitalsVM : MonoBehaviour
{

	public GameObject healthBar;
	public GameObject staminaBar;
	public GameObject xpBar;
	private Text healthText;
	private Text staminaText;
	private Text xpText;
	private Slider healthSlider;
	private Slider staminaSlider;
	private Slider xpSlider;
	private Dinosaur d;
	bool ready = false;
	// Use this for initialization
	public void Initialize ()
	{
		healthSlider = healthBar.GetComponent<Slider> ();
		staminaSlider = staminaBar.GetComponent<Slider> ();
		xpSlider = xpBar.GetComponent<Slider> ();
		healthText = healthBar.GetComponentInChildren<Text> ();
		staminaText = staminaBar.GetComponentInChildren<Text> ();
		xpText = xpBar.GetComponentInChildren<Text> ();
	}
	
	// Update is called once per frame
	void Update ()
	{
		if (ready) {
			float currhp = d.Current_HP ();
			float currstam = d.Current_Stamina ();
			float maxhp = d.Max_HP ();
			float maxstam = d.Max_Stamina ();
			float currxp = d.Current_XP ();
			float nextxp = d.Next_XP_Goal ();
			healthSlider.value = currhp / maxhp;
			staminaSlider.value = currstam / maxstam;
			xpSlider.value = currxp / nextxp;
			healthText.text = ((int)currhp).ToString () + "/" + ((int)maxhp).ToString () + (currhp == maxhp ? "" : "  (+" + d.HP_Regen () + ")");
			staminaText.text = ((int)currstam).ToString () + "/" + ((int)maxstam).ToString () + (currstam == maxstam ? "" : "  (+" + d.Stamina_Regen () + ")");
			xpText.text = ((int)currxp).ToString () + "/" + ((int)nextxp).ToString ();
		} else {
			var obj = GameObject.FindGameObjectWithTag ("Player");
			if (obj != null) {
				d = obj.GetComponent<DinosaurObjectGetter> ().dinosaur ();
				ready = true;
			}
		}
	}
}

