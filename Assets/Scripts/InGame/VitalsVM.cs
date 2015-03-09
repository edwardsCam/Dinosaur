using UnityEngine;
using System.Collections;
using Assets.Scripts;
using UnityEngine.UI;

public class VitalsVM : MonoBehaviour {

    public GameObject healthBar;
    public GameObject staminaBar;
    private Text healthText;
    private Slider healthSlider;
    private Text staminaText;
    private Slider staminaSlider;
    private Dinosaur dino;
	// Use this for initialization
	void Start () 
    {
        healthSlider = healthBar.GetComponent<Slider>();
        staminaSlider = staminaBar.GetComponent<Slider>();
        healthText = healthBar.GetComponentInChildren<Text>();
        staminaText = staminaBar.GetComponentInChildren<Text>();
        dino = GameObject.FindGameObjectWithTag("Player").GetComponent<DinoController>().GetDinosaur();
        
    }
	
	// Update is called once per frame
	void Update () 
    {
        healthSlider.value = dino.Current_HP()/dino.Max_HP();
        staminaSlider.value = dino.Current_Stamina()/dino.Max_Stamina();
        healthText.text = (dino.Current_HP() / dino.Max_HP() * 100).ToString();
        staminaText.text = (dino.Current_Stamina() / dino.Max_Stamina() * 100).ToString(); ;

	}
}

